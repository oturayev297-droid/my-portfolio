import json
import re
import logging
import time
import requests
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from .models import Experience, Project, AIOrder
from .forms import ContactForm
from .ai_service import FallbackAssistant
from .constants import DEFAULT_SKILLS

logger = logging.getLogger(__name__)


def rate_limit(key_prefix, max_requests=10, window=60):
    """Simple IP-based rate limiter using Django cache."""
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            ip = request.META.get('REMOTE_ADDR') or request.META.get('HTTP_X_FORWARDED_FOR', 'unknown')
            cache_key = f"ratelimit:{key_prefix}:{ip}"
            now = time.time()
            hits = cache.get(cache_key, [])
            hits = [t for t in hits if now - t < window]
            if len(hits) >= max_requests:
                logger.warning("Rate limit exceeded for %s: %s", key_prefix, ip)
                return JsonResponse(
                    {'error': 'Juda ko\'p so\'rov yubordingiz. Bir oz kuting va qayta urinib ko\'ring.'},
                    status=429
                )
            hits.append(now)
            cache.set(cache_key, hits, timeout=window)
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator


def send_telegram_sync(bot_token, chat_id, text, parse_mode='HTML'):
    """Telegram xabarini yuboradi. Synchronous — ishonchli, log to'liq.
    
    Thread ishlatilmaydi, chunki gunicorn worker request tugagach
    background thread ni ham tugatishi mumkin.
    Bu call 1-2 soniya oladi, loading indicator bilan frontend da yashiriladi.
    """
    if not bot_token or not chat_id:
        logger.error("Telegram: bot_token yoki chat_id yo'q! (token=%s, chat=%s)",
                     bool(bot_token), bool(chat_id))
        return False

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': parse_mode,
    }

    try:
        resp = requests.post(url, json=payload, timeout=10)
        resp.raise_for_status()
        logger.info("Telegram xabar yuborildi: %s", resp.status_code)
        return True
    except requests.exceptions.Timeout:
        logger.error("Telegram: so'rov vaqti tugadi (timeout) — payload: %.100s", text)
    except requests.exceptions.HTTPError as e:
        logger.error("Telegram API xatosi: %s, response: %.200s", e, getattr(resp, 'text', 'N/A'))
    except requests.exceptions.ConnectionError as e:
        logger.error("Telegram: ulanish xatosi (DNS/proxy): %s", e)
    except requests.exceptions.RequestException as e:
        logger.error("Telegram so'rovida xatolik: %s", e)
    except Exception as e:
        logger.error("Telegram kutilmagan xatolik: %s", e, exc_info=True)

    return False


def api_projects(request):
    projects = Project.objects.all().values('title', 'category', 'description', 'tech_stack', 'image', 'link')
    data = []
    for p in projects:
        p_data = dict(p)
        if p_data['image']:
            p_data['image_url'] = request.build_absolute_uri(settings.MEDIA_URL + p_data['image'])
        else:
            p_data['image_url'] = None
        p_data['tech_list'] = [t.strip() for t in p_data['tech_stack'].split(',')]
        del p_data['image']
        del p_data['tech_stack']
        data.append(p_data)
    return JsonResponse(data, safe=False)

def api_experiences(request):
    experiences = Experience.objects.all().order_by('-start_date').values(
        'company', 'role', 'start_date', 'end_date', 'description'
    )
    return JsonResponse(list(experiences), safe=False)


def home(request):
    projects = Project.objects.all()
    return render(request, 'home.html', {'projects': projects})


def resume(request):
    experiences = Experience.objects.all().order_by('-start_date')
    return render(request, 'resume.html', {'experiences': experiences, 'skills': DEFAULT_SKILLS})


def projects(request):
    projects = Project.objects.all()
    return render(request, 'projects.html', {'projects': projects})


@csrf_exempt
@require_POST
@rate_limit('contact', max_requests=5, window=60)
def contact_view(request):
    form = ContactForm(request.POST)
    if form.is_valid():
        msg = form.save()
        logger.info("Contact message saved from %s (telegram=%s, subject=%s)", msg.full_name, msg.telegram, msg.subject)
        
        bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
        chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
        
        if bot_token and chat_id:
            text = (
                f"🚀 <b>Yangi Xabar!</b>\n\n"
                f"👤 <b>Kimdan:</b> {msg.full_name}\n"
                f"✈️ <b>Telegram:</b> {msg.telegram}\n"
                f"📝 <b>Mavzu:</b> {msg.subject}\n\n"
                f"💬 <b>Xabar:</b>\n{msg.message}"
            )
            send_telegram_sync(bot_token, chat_id, text, parse_mode='HTML')
                
        return JsonResponse({
            'status': 'success', 
            'message': 'Xabaringiz muvaffaqiyatli yuborildi!'
        })
    
    logger.warning("Contact form invalid: %s", form.errors)
    first_error = next(iter(form.errors.values()))[0] if form.errors else 'Qatorlar to\'g\'ri to\'ldirilmagan.'
    return JsonResponse({
        'status': 'error', 
        'errors': form.errors, 
        'message': first_error
    }, status=400)


@csrf_exempt
@require_POST
@rate_limit('ai_chat', max_requests=15, window=60)
def ai_chat_handler(request):
    logger.info("ai_chat_handler called (method=%s)", request.method)

    allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
    allow_all = getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', False)
    if not allow_all and not settings.DEBUG:
        origin = request.META.get('HTTP_ORIGIN') or request.META.get('HTTP_REFERER', '')
        if not origin or not any(o in origin for o in allowed_origins):
            logger.warning("Ruxsatsiz origin: %s", origin)
            return JsonResponse({'error': 'Forbidden'}, status=403)

    try:
        data = json.loads(request.body)
        msg = data.get('message', '')
        history = data.get('history', [])
        logger.info("Message received: %.20s...", msg)

        assistant = FallbackAssistant()
        trimmed_history = history[-10:] if history else []
        response_text, finalized = assistant.chat(msg, history=trimmed_history)
        logger.info("Assistant responded (finalized=%s)", finalized)
        
        # Clean up response text if it contains the metadata tag
        clean_response = re.sub(r"###LEAD_DATA=.*###", "", response_text).strip()
        
        if finalized:
            match = re.search(r"###LEAD_DATA=(.*)###", response_text)
            if match:
                raw_json = match.group(1)
                try:
                    lead_data = json.loads(raw_json)
                except json.JSONDecodeError as e:
                    logger.error("Lead JSON parse xatosi: %s — raw: %.100s", e, raw_json)
                    lead_data = None

                if lead_data:
                    try:
                        order = AIOrder.objects.create(
                            client_name=lead_data.get('name', 'Noma\'lum'),
                            project_brief=lead_data.get('brief', msg),
                            estimated_price="Kelishiladi ($)",
                            chat_transcript=(
                                f"Last Message: {msg}\n"
                                f"Full AI Response: {response_text}"
                            )
                        )

                        bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
                        chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
                        if bot_token and chat_id:
                            text = (
                                f"🔥 *YANGI ZAKAZ (AI)*\n\n"
                                f"👤 *Mijoz:* {order.client_name}\n"
                                f"📁 *Loyiha:* {order.project_brief}\n\n"
                                f"🤖 _Gemini AI orqali suhbat yakunlandi._"
                            )
                            send_telegram_sync(bot_token, chat_id, text, parse_mode='Markdown')
                    except Exception as e:
                        logger.error("Lead saqlash xatosi: %s", e, exc_info=True)

        return JsonResponse({'response': clean_response, 'finalized': finalized})
    except Exception as gl_e:
        return JsonResponse({
            'response': f"Texnik xato: {str(gl_e)}", 
            'finalized': False
        }, status=500)


