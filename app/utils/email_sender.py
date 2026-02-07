import smtplib
from email.message import EmailMessage
import os

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "465"))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_otp_email(to_email: str, otp: str):
    try:
        msg = EmailMessage()
        msg["Subject"] = "Your OTP for Enterprise Chatbot Login"
        msg["From"] = EMAIL_USER
        msg["To"] = to_email
        msg.set_content(f"Your OTP is: {otp}. It is valid for 5 minutes.")

        with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT) as server:
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)

    except Exception as e:
        print("EMAIL ERROR:", e)
        raise
