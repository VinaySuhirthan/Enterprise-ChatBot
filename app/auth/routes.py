from fastapi import APIRouter, HTTPException
from .schemas import UserLogin, Token
from .security import hash_password, verify_password, create_access_token
from app.auth.otp import generate_otp, verify_otp
from app.utils.email_sender import send_otp_email
from .schemas import OTPVerify


router = APIRouter(prefix="/auth", tags=["auth"])

# TEMP user store (will replace later)
FAKE_USER_DB = {
    "kskeerthivsn@gmail.com": {
        "email": "kskeerthivsn@gmail.com",
        "hashed_password": hash_password("admin123")
    }
}


@router.post("/login")
def login(user: UserLogin):
    db_user = FAKE_USER_DB.get(user.email)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    otp = generate_otp(user.email)
    send_otp_email(user.email, otp)

    return {"detail": "OTP sent to registered email"}

@router.post("/verify-otp", response_model=Token)
def verify_otp_route(data: OTPVerify):
    if not verify_otp(data.email, data.otp):
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    token = create_access_token({"sub": data.email})
    return {"access_token": token}

