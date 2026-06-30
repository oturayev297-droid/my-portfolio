import json
import re
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

try:
    from google import genai
except ImportError:
    genai = None

FALLBACK_RESPONSES = {
    'salom': "Assalomu alaykum! Men Ozodbekning virtual yordamchisiman. Sizga qanday loyiha kerak? (Landing, E-commerce, Mobile App...)",
    'hello': "Hello! I'm Ozodbek's virtual assistant. What kind of project are you looking for? (Landing, E-commerce, Mobile App...)",
    'здравствуйте': "Здравствуйте! Я виртуальный помощник Озодбека. Какой проект вас интересует? (Лендинг, E-commerce, Мобильное приложение...)",
}

PRICING_INFO = """
OZODBEK TURAYEV — XIZMATLAR VA NARXLAR

============================================
VEb SAYTLAR
============================================
- Landing Page (1 sahifa): $300 - $500
- Biznes sayt (5-10 sahifa): $800 - $1,500
- E-commerce (onlayn do'kon): $2,000 - $5,000
- Admin panel bilan: $1,500 - $4,000

============================================
MOBIL ILOVALAR
============================================
- iOS / Android ilova: $1,500 - $5,000
- Full-stack (backend + mobile): $3,000 - $8,000

============================================
AI & CHATBOT
============================================
- Telegram bot (oddiy): $300 - $800
- Telegram bot (AI bilan): $1,000 - $3,000
- AI Chat integratsiyasi: $1,500 - $5,000
- Custom AI yechim: $3,000+

============================================
QO'SHIMCHA XIZMATLAR
============================================
- UI/UX Dizayn: $300 - $1,000
- IT Mentorlik / Darslar: $50/soat
- Mavjud saytni modernizatsiya: $500 - $2,000
- SEO optimizatsiya: $200 - $1,000

============================================
NEGA AYNAN MEN?
============================================
- 100% mijozlar mamnuniyati
- Sifat kafolati + 30 kun bepul qo'llab-quvvatlash
- Har bir loyihaga shaxsiy yondashish
- Tez va sifatli topshirish (7-14 kun)

BONUS: Barcha loyihalarga 1 oy bepul hosting va domain + AI chat integratsiyasi!
Bog'lanish: @Turayevvv_Web
"""

SERVICES_INFO = """
Ozodbekning xizmatlari:
1. Veb Dasturlash - Django + JavaScript
2. Mobil Ilovalar - iOS / Android
3. UI/UX Dizayn
4. AI & IT Mentorlik
5. AI Integratsiyasi
6. Telegram Botlar

Batafsil ma'lumot uchun portfolio saytining Xizmatlar bo'limiga o'ting.
"""

ABOUT_INFO = """
OZODBEK TURAYEV — Buxorolik Full-stack dasturchi va AI mutaxassisi.

TAJRIBA:
- 5+ yil IT sohasida (2020-yildan beri)
- 50+ muvaffaqiyatli loyihalar (E-commerce, CRM, AI chatbotlar, mobil ilovalar)
- 500+ o'quvchilarga mentorlik qilgan

TEXNOLOGIYALAR:
Backend: Python, Django, PostgreSQL, Redis, REST API
Frontend: React, JavaScript, HTML/CSS, Bootstrap
Mobile: iOS (Swift), Android (Kotlin)
AI: Gemini API, ChatGPT API, Machine Learning
Boshqa: Docker, Git, CI/CD, Telegram Botlar

LOYIHALAR:
- Upgrade Tech Store — E-commerce platforma
- Anor Travel — Turizm platformasi
- Restaurantly — Restoran CRM tizimi
- Future Work — AI Freelance Platform (tez kunda)
- Usmon Kafe — Interaktiv menyu sayti
- Foodie — Food Delivery mobil ilova

YUTUQLAR:
- 50+ mijozlar O'zbekiston, AQSH, Yevropa va BAA dan
- 100% mijozlar mamnuniyati
- 24/7 qo'llab-quvvatlash
- Har bir loyihaga individual yondashish

Hozirda yangi loyihalar va hamkorlik uchun ochiq!
Telegram: @Turayevvv_Web
"""

CONTACT_INFO = """
Ozodbek bilan bog'lanish:
- Telegram: @Turayevvv_Web
- Manzil: Toshkent / Samarqand / Buxoro
Yoki portfolio saytidagi Aloqa bo'limi orqali xabar yuboring!
"""


class FallbackAssistant:
    def __init__(self):
        self.client = None
        self._init_gemini()

    def _init_gemini(self):
        api_key = getattr(settings, 'GEMINI_API_KEY', '')
        if api_key and genai:
            try:
                self.client = genai.Client(
                    api_key=api_key,
                    http_options={"timeout": 10000},
                )
                self.model_name = "gemini-2.0-flash"
            except Exception as e:
                logger.warning("Gemini init xatolik: %s", e)
                self.client = None

    def get_system_prompt(self):
        return """
        Siz Ozodbek Turayevning (Portfolio egasi) shaxsiy virtual yordamchisiz. 
        Ozodbek haqida: Buxorolik, 2020-yildan beri IT-da, Middle darajadagi mutaxassis. 
        AI jamoasi bilan Python/Django, iOS va Android (AI bilan integratsiyalashgan) loyihalar yaratadi.
        
        Sizning vazifalaringiz:
        1. Mijozlar bilan xushmuomala Ozodbek nomidan gaplashish.
        2. Ularning loyiha g'oyalari bo'yicha maslahat berish.
        3. Standart narxlar haqida ma'lumot berish.
        4. Agar mijoz loyiha zakaz qilmoqchi bo'lsa, uning ismi va loyiha haqida ma'lumotni oling.
        
        Tillar: O'zbek, Rus, Ingliz. Qaysi tilda murojaat qilishsa, o'sha tilda javob bering.
        """

    def _fallback_reply(self, message):
        msg_lower = message.lower()

        if any(w in msg_lower for w in ['narx', 'narhi', 'price', 'cost', 'цена', 'стоимость']):
            return PRICING_INFO.strip(), False

        if any(w in msg_lower for w in ['xizmat', 'service', 'услуг']):
            return SERVICES_INFO.strip(), False

        if any(w in msg_lower for w in ['kim', 'who', 'ozodbek', 'haqida', 'about', 'кто']):
            return ABOUT_INFO.strip(), False

        if any(w in msg_lower for w in ['aloqa', 'contact', 'bog\'lanish', 'связ']):
            return CONTACT_INFO.strip(), False

        if any(w in msg_lower for w in ['salom', 'hi', 'hello', 'assalomu', 'привет', 'здравствуйте']):
            if 'salom' in msg_lower or 'assalomu' in msg_lower:
                return FALLBACK_RESPONSES['salom'], False
            if 'hello' in msg_lower or 'hi' in msg_lower:
                return FALLBACK_RESPONSES['hello'], False
            return FALLBACK_RESPONSES['здравствуйте'], False

        if any(w in msg_lower for w in ['loyiha', 'project', 'portfolio', 'sayt', 'site', 'сайт', 'проект']):
            return ("Mening loyihalarimni portfolio saytimning 'Loyihalar' bo'limida ko'rishingiz mumkin. "
                    "Sizga qanday loyiha kerak? (Veb-sayt, Mobil ilova, Telegram Bot)"), False

        if any(w in msg_lower for w in ['zakaz', 'order', 'buy', 'kerak', 'yasad', 'сделать', 'заказ']):
            return ("Ajoyib! Loyihangiz haqida qisqacha ma'lumot bering va ismingizni yozing. "
                    "Men siz bilan bog'lanaman yoki Ozodbek sizga aloqaga chiqadi."), False

        return ("Kechirasiz, sizni to'liq tushunmadim. Iltimos, savolingizni aniqroq yozing yoki "
                "quyidagilardan birini tanlang:\n\n"
                "1. Narxlar haqida\n"
                "2. Xizmatlar haqida\n"
                "3. Ozodbek haqida\n"
                "4. Loyihalar haqida\n"
                "5. Aloqa / Bog'lanish\n"
                "6. Yangi loyiha buyurtma qilish"), False

    def chat(self, user_message, history=[]):
        # Try Gemini first
        if self.client:
            try:
                contents = []
                for h in history:
                    contents.append({
                        "role": h['role'],
                        "parts": [{"text": h['content']}]
                    })
                contents.append({
                    "role": "user",
                    "parts": [{"text": user_message}]
                })

                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=contents,
                    config={"system_instruction": self.get_system_prompt()}
                )
                text = response.text
                finalized = "###LEAD_DATA=" in text
                return text, finalized
            except Exception as e:
                error_msg = str(e)
                if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                    return self._fallback_reply(user_message)
                if "403" in error_msg or "PERMISSION_DENIED" in error_msg or "leaked" in error_msg:
                    return self._fallback_reply(user_message)
                return f"Xatolik yuz berdi: {error_msg}", False

        return self._fallback_reply(user_message)
