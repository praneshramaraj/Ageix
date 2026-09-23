import os
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "/tmp/aegisx_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class StorageService:
    @staticmethod
    async def save_upload_file(file: UploadFile, subfolder: str = "media") -> dict:
        target_dir = os.path.join(UPLOAD_DIR, subfolder)
        os.makedirs(target_dir, exist_ok=True)
        
        ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
        file_id = f"{uuid.uuid4().hex[:12]}.{ext}"
        file_path = os.path.join(target_dir, file_id)
        
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
            
        file_type = "image" if ext in ["jpg", "jpeg", "png", "webp"] else \
                    "video" if ext in ["mp4", "mov", "avi"] else \
                    "audio" if ext in ["mp3", "wav", "m4a", "ogg"] else "document"
                    
        return {
            "file_name": file.filename,
            "file_path": file_path,
            "file_type": file_type,
            "file_size_bytes": len(contents),
            "url": f"/api/v1/media/download/{file_id}"
        }

storage_service = StorageService()
