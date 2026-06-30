# -*- coding: utf-8 -*-
"""
Telegram Chat ID auto-detector.
Run this script, send /start to your bot, and it will save your Chat ID to .env
"""
import sys
import io
import urllib.request
import json
import os

# Force UTF-8 output for Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BOT_TOKEN = "8573778865:AAFvqx0wNLXUV7Jf-cfhe4GXhADWO1KGtnU"
ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")

print("=" * 50)
print("Telegram Chat ID Detector")
print("=" * 50)
print("\nTelegram'da botingizga /start yozing!")
print("Kutmoqda (30 soniya)...\n")

url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates?timeout=30"

try:
    req = urllib.request.urlopen(url, timeout=35)
    data = json.loads(req.read().decode())

    if data.get("ok") and data.get("result"):
        for update in data["result"]:
            chat = update.get("message", {}).get("chat", {})
            chat_id = chat.get("id")
            first_name = chat.get("first_name", "")

            if chat_id:
                print(f"Chat ID topildi: {chat_id} ({first_name})")

                # Read current .env
                env_content = ""
                if os.path.exists(ENV_FILE):
                    with open(ENV_FILE, "r") as f:
                        env_content = f.read()

                # Replace or add TELEGRAM_CHAT_ID
                if "TELEGRAM_CHAT_ID=" in env_content:
                    lines = env_content.splitlines()
                    new_lines = []
                    for line in lines:
                        if line.startswith("TELEGRAM_CHAT_ID="):
                            new_lines.append(f"TELEGRAM_CHAT_ID={chat_id}")
                        else:
                            new_lines.append(line)
                    env_content = "\n".join(new_lines)
                else:
                    env_content += f"\nTELEGRAM_CHAT_ID={chat_id}"

                with open(ENV_FILE, "w") as f:
                    f.write(env_content)

                print(f".env faylga yozildi: TELEGRAM_CHAT_ID={chat_id}")

                # Send confirmation to user via Telegram
                msg = "Portfolio saytingizdan xabarlar endi shu chatga yetib keladi!"
                send_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
                payload = json.dumps({
                    "chat_id": chat_id,
                    "text": f"Botingiz ulandi! {msg}"
                }).encode()
                req2 = urllib.request.Request(
                    send_url, data=payload,
                    headers={"Content-Type": "application/json"}
                )
                urllib.request.urlopen(req2)
                print("Tasdiqlash xabari Telegram'ga yuborildi!")
                break
    else:
        print("Hech qanday xabar topilmadi. Botga /start yozdingizmi?")
        print("Qaytadan ishga tushiring.")

except Exception as e:
    print(f"Xatolik: {e}")

input("\nEnter bosing...")
