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
    username: Optional[str] = None
    email: Optional[str] = None
    password: str
    phone: str
    age: Optional[int] = 25
    bloodGroup: Optional[str] = "O+"
    gender: Optional[str] = "Other"
    emergencyContact: Optional[str] = "+91 98112 33441"
    role: Optional[str] = "Civilian"

class UserLoginSchema(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    identifier: Optional[str] = None
    password: str

class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

# In-Memory DB fallback with demo users
CIVILIAN_USERS_DB = {
    "commander": {
        "id": "usr_commander_01",
        "username": "commander",
        "fullName": "Commander Alex Vance",
        "phone": "+91 98112 33441",
        "age": 35,
        "bloodGroup": "O+",
        "gender": "Male",
        "emergencyContact": "+91 98112 33441",
        "email": "commander@aegisx.gov",
        "roles": ["Disaster Commander"],
        "hashed_password": get_password_hash("password123")
    },
    "admin": {
        "id": "usr_admin_01",
        "username": "admin",
        "fullName": "Director Elena Rostova",
        "phone": "+91 98112 33442",
        "age": 40,
        "bloodGroup": "A+",
        "gender": "Female",
        "emergencyContact": "+91 98112 33442",
        "email": "admin@aegisx.gov",
        "roles": ["Administrator"],
        "hashed_password": get_password_hash("password123")
    }
}

@router.post("/register", response_model=TokenSchema)
def register(user_data: UserRegisterSchema, db: Optional[Session] = Depends(get_db)):
    if user_data.username and user_data.username.strip():
        uname = user_data.username.strip().lower()
    elif user_data.email and user_data.email.strip():
        uname = user_data.email.strip().lower().split('@')[0]
    else:
        raise HTTPException(status_code=400, detail="Username or email is required")

    email = user_data.email.strip().lower() if user_data.email else f"{uname}@aegisx.org"

    # 1. Check duplicate username in DB
    if db is not None:
        try:
            existing = db.query(CivilianUser).filter(
                (CivilianUser.username == uname) | (CivilianUser.username == email)
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="Username already registered. Please choose another username.")
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e

    if uname in CIVILIAN_USERS_DB:
        raise HTTPException(status_code=400, detail="Username already registered. Please choose another username.")

    for u in CIVILIAN_USERS_DB.values():
        if u.get("email", "").lower() == email:
            raise HTTPException(status_code=400, detail="Email already registered. Please use another email.")

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
        "email": email,
        "roles": [user_data.role or "Civilian"],
        "hashed_password": hashed_pwd
    }

    # Save to PostgreSQL if available
    if db is not None:
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
            "email": user_dict["email"],
            "phone": user_dict["phone"],
            "age": user_dict["age"],
            "bloodGroup": user_dict["bloodGroup"],
            "gender": user_dict["gender"],
            "emergencyContact": user_dict["emergencyContact"],
            "roles": user_dict["roles"]
        }
    }

@router.post("/login", response_model=TokenSchema)
def login(creds: UserLoginSchema, db: Optional[Session] = Depends(get_db)):
    raw_ident = creds.identifier or creds.username or creds.email or ""
    ident = raw_ident.strip().lower()
    if not ident:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email is required"
        )

    target_user = None

    # Check PostgreSQL
    if db is not None:
        try:
            ident_prefix = ident.split('@')[0]
            db_user = db.query(CivilianUser).filter(
                (CivilianUser.username == ident) | 
                (CivilianUser.username == ident_prefix)
            ).first()
            if db_user:
                if not verify_password(creds.password, db_user.password_hash):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid email/username or password",
                        headers={"WWW-Authenticate": "Bearer"},
                    )
                target_user = {
                    "id": db_user.id,
                    "username": db_user.username,
                    "fullName": db_user.full_name,
                    "email": f"{db_user.username}@aegisx.org",
                    "phone": db_user.phone,
                    "age": db_user.age,
                    "bloodGroup": db_user.blood_group,
                    "gender": db_user.gender,
                    "emergencyContact": db_user.emergency_contact,
                    "roles": ["Civilian"],
                    "hashed_password": db_user.password_hash
                }
        except HTTPException:
            raise
        except Exception as e:
            print(f"[Auth Backend] DB query warning: {e}")

    # Check in-memory DB fallback
    if not target_user:
        for u in CIVILIAN_USERS_DB.values():
            u_email = (u.get("email") or "").strip().lower()
            u_uname = (u.get("username") or "").strip().lower()
            if ident == u_uname or ident == u_email or (ident.startswith(u_uname + "@")) or (u_email.startswith(ident + "@")):
                if not verify_password(creds.password, u["hashed_password"]):
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid email/username or password",
                        headers={"WWW-Authenticate": "Bearer"},
                    )
                target_user = u
                break

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

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
            "email": target_user.get("email", f"{target_user['username']}@aegisx.org"),
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

