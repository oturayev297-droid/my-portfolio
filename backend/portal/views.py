import json
import re
import threading
import logging
import requests
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import Experience, Project, AIOrder
from .forms import ContactForm
from .ai_service import FallbackAssistant

logger = logging.getLogger(__name__)


def send_telegram_async(bot_token, chat_id, text, parse_mode='HTML'):
    """Sends a Telegram message asynchronously in a background thread with a timeout."""
    def _send():
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        try:
            requests.post(url, data={
                'chat_id': chat_id,
                'text': text,
                'parse_mode': parse_mode
            }, timeout=5)
        except requests.RequestException:
            pass

    threading.Thread(target=_send, daemon=True).start()


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

def home(request):
    projects = Project.objects.all()
    return render(request, 'home.html', {'projects': projects})


def resume(request):
    experiences = Experience.objects.all().order_by('-start_date')
    skills = [
        'Python', 'Django', 'JavaScript', 'HTML/CSS', 
        'Modern UI/UX', 'Git'
    ]
    return render(request, 'resume.html', {'experiences': experiences, 'skills': skills})


def projects(request):
    projects = Project.objects.all()
    return render(request, 'projects.html', {'projects': projects})


@csrf_exempt
@require_POST
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
            send_telegram_async(bot_token, chat_id, text, parse_mode='HTML')
            logger.info("Telegram notification sent for contact from %s", msg.full_name)
                
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
def ai_chat_handler(request):
    logger.info("ai_chat_handler called (method=%s)", request.method)
    try:
        data = json.loads(request.body)
        msg = data.get('message', '')
        history = data.get('history', [])
        logger.info("Message received: %.20s...", msg)

        assistant = FallbackAssistant()
        response_text, finalized = assistant.chat(msg, history=history)
        logger.info("Assistant responded (finalized=%s)", finalized)
        
        # Clean up response text if it contains the metadata tag
        clean_response = re.sub(r"###LEAD_DATA=.*###", "", response_text).strip()
        
        if finalized:
            match = re.search(r"###LEAD_DATA=(.*)###", response_text)
            if match:
                try:
                    lead_data = json.loads(match.group(1))
                    # Save to Database
                    order = AIOrder.objects.create(
                        client_name=lead_data.get('name', 'Noma\'lum'),
                        project_brief=lead_data.get('brief', msg),
                        estimated_price="Kelishiladi ($)",
                        chat_transcript=(
                            f"Last Message: {msg}\n"
                            f"Full AI Response: {response_text}"
                        )
                    )
                    
                    # Notify Ozodbek via Telegram (SMS-like)
                    bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
                    chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
                    if bot_token and chat_id:
                        text = (
                            f"🔥 *YANGI ZAKAZ (AI)*\n\n"
                            f"👤 *Mijoz:* {order.client_name}\n"
                            f"📁 *Loyiha:* {order.project_brief}\n\n"
                            f"🤖 _Gemini AI orqali suhbat yakunlandi._"
                        )
                        send_telegram_async(bot_token, chat_id, text, parse_mode='Markdown')
                except Exception:
                    pass

        return JsonResponse({'response': clean_response, 'finalized': finalized})
    except Exception as gl_e:
        return JsonResponse({
            'response': f"Texnik xato: {str(gl_e)}", 
            'finalized': False
        }, status=500)


