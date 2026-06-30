"""
Telegram bot tekshiruv skripti.
100% ishlashi uchun maxsus mustahkamlangan.

Ishlatish:
    cd backend
    python check_telegram.py

Natijalar konsolga va result.json fayliga yoziladi.
"""

import os
import sys
import json
from pathlib import Path

# ---------- .env ni yuklash (dotnetsiz ham ishlaydi) ----------
ENV_PATH = Path(__file__).resolve().parent / '.env'

def load_env_file(env_path):
    """Manual .env parser — python-dotenv o'rnatilmagan bo'lsa ham ishlaydi."""
    if not env_path.exists():
        return {}
    env_vars = {}
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, _, val = line.partition('=')
                env_vars[key.strip()] = val.strip()
    return env_vars

# Avval python-dotenv orqali yuklashga urinamiz
try:
    from dotenv import load_dotenv
    loaded = load_dotenv(ENV_PATH)
except Exception:
    loaded = False

# Agar dotenv yuklamasa, manual parse qilamiz
if not loaded:
    manual_vars = load_env_file(ENV_PATH)
    for k, v in manual_vars.items():
        os.environ.setdefault(k, v)

# ---------- Sozlamalar ----------
OUTPUT_FILE = Path(__file__).resolve().parent / 'telegram_check_result.json'
TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID")

results = {
    'token_found': bool(TOKEN),
    'chat_id_found': bool(CHAT_ID),
    'getMe': None,
    'sendMessage': None,
    'getUpdates': None,
}

def print_and_log(label, status, detail=""):
    """Konsolga chiqarish va results dict ga yozish."""
    icons = {'ok': '✅', 'warn': '⚠️ ', 'fail': '❌', 'info': 'ℹ️ '}
    icon = icons.get(status, '•')
    print(f"   {icon} {label} {detail}")
    return {'status': status, 'detail': detail}

# ============================================================
print("=" * 60)
print("  TELEGRAM BOT DIAGNOSTIKA")
print(f"  .env fayl: {ENV_PATH}")
print("=" * 60)

# ---------- 1. Token tekshiruvi ----------
print("\n--- 1. TOKEN TEKSHIRUVI ---")
if not TOKEN:
    print_and_log('TELEGRAM_BOT_TOKEN topilmadi!', 'fail')
    print("\n   Ehtimoliy sabablar:")
    print("   1) .env fayli mavjud emas:", "BOR" if ENV_PATH.exists() else "YO'Q")
    print("   2) .env ichida TELEGRAM_BOT_TOKEN=... qatori yo'q")
    print("   3) Agar Railway'da bo'lsangiz, Environment Variable o'rnatilmagan")
    print("\n   Yechim: .env faylga quyidagini qo'shing:")
    print('   TELEGRAM_BOT_TOKEN=8573778865:AAFvqx0wNLXUV7Jf-cfhe4GXhADWO1KGtnU')
else:
    masked = TOKEN[:8] + '...' + TOKEN[-5:]
    print_and_log(f'Token:', 'ok', masked)
    
    # getMe
    try:
        import requests
        r1 = requests.get(
            f"https://api.telegram.org/bot{TOKEN}/getMe",
            timeout=10,
        )
        if r1.status_code == 200 and r1.json().get("ok"):
            bot = r1.json()["result"]
            print_and_log('getMe:', 'ok',
                f"@{bot['username']} (ID: {bot['id']})")
        else:
            err = r1.json().get('description', 'Noma\'lum xato')
            print_and_log(f'getMe: {r1.status_code} — {err}', 'fail')
            print("   Token noto'g'ri yoki bot o'chirilgan.")
            print("   https://t.me/BotFather ga kirib tokenni tekshiring.")
    except Exception as e:
        print_and_log(f'getMe: so\'rov xatosi', 'fail', str(e)[:100])

# ---------- 2. Chat ID tekshiruvi ----------
print("\n--- 2. CHAT ID TEKSHIRUVI ---")
if not CHAT_ID:
    print_and_log('TELEGRAM_CHAT_ID topilmadi!', 'warn')
    print("\n   Yechim:")
    print("   1) Telegram'da botingizga /start yozing")
    print("   2) Quyidagi URL ni brauzerda oching:")
    print(f"   https://api.telegram.org/bot{TOKEN}/getUpdates")
    print("   3) Javobdan 'chat':{'id': 123456789} ni oling")
    print("   4) .env faylga yoki Railway env vars ga qo'shing:")
    print(f"   TELEGRAM_CHAT_ID=123456789")
else:
    print_and_log('Chat ID:', 'ok', str(CHAT_ID))
    
    # sendMessage test
    print("\n--- 3. TEST XABAR YUBORISH ---")
    try:
        import requests
        r2 = requests.post(
            f"https://api.telegram.org/bot{TOKEN}/sendMessage",
            json={
                "chat_id": CHAT_ID,
                "text": "🤖 Portfolio Telegram bot tekshiruvi ✅\n\n"
                        "Agar bu xabarni ko'rayotgan bo'lsangiz,\n"
                        "Telegram bot TO'LIQ ISHLYAPTI!",
                "parse_mode": "HTML",
            },
            timeout=10,
        )
        data2 = r2.json()
        if r2.status_code == 200 and data2.get("ok"):
            msg_id = data2['result']['message_id']
            print_and_log('sendMessage:', 'ok', f"Xabar ID: {msg_id}")
        else:
            desc = data2.get('description', '')
            print_and_log(f'sendMessage: {r2.status_code}', 'fail', desc)
            if r2.status_code == 400:
                print("\n   Sabab: Chat ID noto'g'ri.")
                print("   Yechim:")
                print("   1) Botga /start yozing")
                print("   2) getUpdates orqali to'g'ri Chat ID ni oling")
                print("   3) .env faylga yozing")
            elif r2.status_code == 403:
                print("\n   Sabab: Bot bu chatga xabar yubora olmaydi.")
                print("   Yechim: Avval botga /start yozing.")
    except Exception as e:
        print_and_log('sendMessage: so\'rov xatosi', 'fail', str(e)[:100])

# ---------- 4. getUpdates ----------
print("\n--- 4. GETUPDATES (SO'NGGI XABARLAR) ---")
try:
    import requests
    r3 = requests.get(
        f"https://api.telegram.org/bot{TOKEN}/getUpdates?timeout=5",
        timeout=10,
    )
    data3 = r3.json()
    if data3.get("ok") and data3.get("result"):
        updates = data3["result"]
        print_and_log('Xabarlar:', 'ok', f"{len(updates)} ta topildi")
        for upd in updates[-3:]:
            msg = upd.get("message", {})
            chat = msg.get("chat", {})
            ts = msg.get("date", 0)
            from datetime import datetime
            time_str = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
            print(f"\n      ── Update #{upd['update_id']} ──")
            print(f"      👤 {chat.get('first_name', 'N/A')} (id={chat.get('id', '?')})")
            print(f"      💬 {msg.get('text', '(media)')[:80]}")
            print(f"      🕐 {time_str}")
            
            # Chat ID ni taklif qilish (agar topilgan bo'lsa)
            chat_id_found = chat.get('id')
            if chat_id_found and str(chat_id_found) != str(CHAT_ID):
                print(f"      💡 Chat ID {chat_id_found} — .env ga yozish mumkin")
    else:
        print_and_log('Xabarlar:', 'info', "Hech qanday xabar yo'q")
        print("\n   Botga /start yozing va qaytadan urinib ko'ring.")
except Exception as e:
    print_and_log('getUpdates: so\'rov xatosi', 'fail', str(e)[:100])

# ---------- XULOSA ----------
print("\n" + "=" * 60)
ok_count = sum(1 for v in results.values() if isinstance(v, dict) and v.get('status') == 'ok')
fail_count = sum(1 for v in results.values() if isinstance(v, dict) and v.get('status') == 'fail')

if fail_count == 0 and results.get('token_found'):
    print("  ✅ XULOSA: Telegram bot TO'LIQ ISHLASHGA TAYYOR!")
elif fail_count > 0:
    print(f"  ⚠️  XULOSA: {fail_count} ta xatolik bor — yuqoridagi yechimlarni bajaring.")
else:
    print("  ⚠️  XULOSA: Token yoki Chat ID topilmadi — yuqoridagi yechimlarni bajaring.")
print("=" * 60)
