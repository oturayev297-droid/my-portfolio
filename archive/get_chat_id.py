# -*- coding: utf-8 -*-
import sys
import io
import os
import json
import urllib.request
import urllib.parse

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
if not BOT_TOKEN:
    print("XATOLIK: TELEGRAM_BOT_TOKEN environment variable o'rnatilmagan!")
    print("Ishlatish: set TELEGRAM_BOT_TOKEN=your_token_here && python get_chat_id.py")
    sys.exit(1)

ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend", ".env")

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

                env_content = ""
                if os.path.exists(ENV_FILE):
                    with open(ENV_FILE, "r", encoding="utf-8") as f:
                        env_content = f.read()

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

                with open(ENV_FILE, "w", encoding="utf-8") as f:
                    f.write(env_content)

                print(f".env faylga yozildi: TELEGRAM_CHAT_ID={chat_id}")

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

except Exception as e:
    print(f"Xatolik: {e}")

input("\nEnter bosing...")
