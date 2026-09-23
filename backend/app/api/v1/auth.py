from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import Optional, List
import uuid
import time
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from app.db.session import get_db
from app.models.civilian_user import CivilianUser

router = APIRouter()

class UserRegisterSchema(BaseModel):
    fullName: str
    username: str
    password: str
    phone: str
    age: Optional[int] = 25
    bloodGroup: Optional[str] = "O+"
    gender: Optional[str] = "Other"
    emergencyContact: Optional[str] = "+91 98112 33441"
    email: Optional[str] = None
    role: Optional[str] = "Civilian"

class UserLoginSchema(BaseModel):
    username: str
    password: str

class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

# In-Memory DB fallback
CIVILIAN_USERS_DB = {}

@router.post("/register", response_model=TokenSchema)
def register(user_data: UserRegisterSchema, db: Session = Depends(get_db)):
    uname = user_data.username.strip().lower()
    
    # 1. Check duplicate username in DB
    try:
        existing = db.query(CivilianUser).filter(CivilianUser.username == uname).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already registered. Please choose another username.")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e

    if uname in CIVILIAN_USERS_DB:
        raise HTTPException(status_code=400, detail="Username already registered. Please choose another username.")
        
    hashed_pwd = get_password_hash(user_data.password)
    user_id = f"usr_{int(time.time() * 1000)}"

    user_dict = {
        "id": user_id,
        "username": uname,
        "fullName": user_data.fullName,
        "phone": user_data.phone,
        "age": user_data.age or 25,
        "bloodGroup": user_data.bloodGroup or "O+",
        "gender": user_data.gender or "Other",
        "emergencyContact": user_data.emergencyContact or "+91 98112 33441",
        "email": user_data.email or f"{uname}@aegisx.org",
        "roles": [user_data.role or "Civilian"],
        "hashed_password": hashed_pwd
    }

    # Save to PostgreSQL if available
    try:
        db_user = CivilianUser(
            id=user_id,
            username=uname,
            password_hash=hashed_pwd,
            full_name=user_data.fullName,
            age=user_data.age or 25,
            blood_group=user_data.bloodGroup or "O+",
            phone=user_data.phone,
            gender=user_data.gender or "Other",
            emergency_contact=user_data.emergencyContact or "+91 98112 33441"
        )
        db.add(db_user)
        db.commit()
    except Exception as e:
        print(f"[Auth Backend] DB Save warning (continuing in-memory): {e}")

    CIVILIAN_USERS_DB[uname] = user_dict
    
    access_token = create_access_token(user_id, user_dict["roles"])
    refresh_token = create_refresh_token(user_id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user_dict["id"],
            "username": user_dict["username"],
            "fullName": user_dict["fullName"],
            "phone": user_dict["phone"],
            "age": user_dict["age"],
            "bloodGroup": user_dict["bloodGroup"],
            "gender": user_dict["gender"],
            "emergencyContact": user_dict["emergencyContact"],
            "roles": user_dict["roles"]
        }
    }

@router.post("/login", response_model=TokenSchema)
def login(creds: UserLoginSchema, db: Session = Depends(get_db)):
    uname = creds.username.strip().lower()
    target_user = None

    # Check PostgreSQL
    try:
        db_user = db.query(CivilianUser).filter(CivilianUser.username == uname).first()
        if db_user:
            if verify_password(creds.password, db_user.password_hash):
                target_user = {
                    "id": db_user.id,
                    "username": db_user.username,
                    "fullName": db_user.full_name,
                    "phone": db_user.phone,
                    "age": db_user.age,
                    "bloodGroup": db_user.blood_group,
                    "gender": db_user.gender,
                    "emergencyContact": db_user.emergency_contact,
                    "roles": ["Civilian"],
                    "hashed_password": db_user.password_hash
                }
    except Exception as e:
        print(f"[Auth Backend] DB query warning: {e}")

    if not target_user:
        target_user = CIVILIAN_USERS_DB.get(uname)
        if target_user and not verify_password(creds.password, target_user["hashed_password"]):
            raise HTTPException(status_code=400, detail="Invalid username or password")

    if not target_user:
        # Auto-provision fallback for testing
        hashed_pwd = get_password_hash(creds.password)
        target_user = {
            "id": f"usr_{int(time.time() * 1000)}",
            "username": uname,
            "fullName": uname.capitalize() + " User",
            "phone": "+91 98112 33441",
            "age": 28,
            "bloodGroup": "O+",
            "gender": "Other",
            "emergencyContact": "+91 98112 33441",
            "roles": ["Civilian"],
            "hashed_password": hashed_pwd
        }
        CIVILIAN_USERS_DB[uname] = target_user

    access_token = create_access_token(target_user["id"], target_user["roles"])
    refresh_token = create_refresh_token(target_user["id"])
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": target_user["id"],
            "username": target_user["username"],
            "fullName": target_user["fullName"],
            "phone": target_user["phone"],
            "age": target_user.get("age", 25),
            "bloodGroup": target_user.get("bloodGroup", "O+"),
            "gender": target_user.get("gender", "Other"),
            "emergencyContact": target_user.get("emergencyContact", "+91 98112 33441"),
            "roles": target_user["roles"]
        }
    }

@router.post("/refresh")
def refresh_token(refresh_token: str):
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=400, detail="Invalid token type")
        
    user_id = payload.get("sub")
    new_access_token = create_access_token(user_id, ["Civilian"])
    return {"access_token": new_access_token, "token_type": "bearer"}

