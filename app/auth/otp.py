import random
import time

OTP_STORE = {}  # email -> (otp, expiry)

OTP_EXPIRY_SECONDS = 300  # 5 minutes


def generate_otp(email: str) -> str:
    otp = str(random.randint(100000, 999999))
    expiry = time.time() + OTP_EXPIRY_SECONDS
    OTP_STORE[email] = (otp, expiry)
    return otp


def verify_otp(email: str, otp: str) -> bool:
    if email not in OTP_STORE:
        return False

    stored_otp, expiry = OTP_STORE[email]

    if time.time() > expiry:
        del OTP_STORE[email]
        return False

    if stored_otp == otp:
        del OTP_STORE[email]
        return True

    return False
