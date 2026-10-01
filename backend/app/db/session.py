from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    connect_args={"connect_timeout": 1},
)

import time
from sqlalchemy import text

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

_db_healthy: bool | None = None
_last_health_check: float = 0.0

def is_db_available() -> bool:
    global _db_healthy, _last_health_check
    now = time.time()
    if _db_healthy is not None and (now - _last_health_check) < 15.0:
        return _db_healthy
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        _db_healthy = True
    except Exception:
        _db_healthy = False
    _last_health_check = now
    return _db_healthy

def get_db():
    if not is_db_available():
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
