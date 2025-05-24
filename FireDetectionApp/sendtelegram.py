# send_telegram.py
import requests

BOT_TOKEN = ''
CHAT_ID = ''

def send_telegram_alert(message):
    url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'
    payload = {
        'chat_id': CHAT_ID,
        'text': message
    }
    try:
        response = requests.post(url, data=payload)
        print("Status:", response.status_code)
        print("Response:", response.text)

        if response.status_code != 200:
            print("❌ Telegram API Error:", response.text)

    except Exception as e:
        print("❌ Telegram Request Failed:", e)
send_telegram_alert("🔥 Test fire alert from function")
