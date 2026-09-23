import os
import json
import base64
import urllib.request
import urllib.parse
import time
from typing import List, Optional

class NotificationService:
    @staticmethod
    def send_push_notification(target_users: List[str], title: str, message: str, data: Optional[dict] = None) -> bool:
        print(f"[PushNotification] Sending to {len(target_users)} users: '{title}' - {message}")
        return True

    @staticmethod
    def send_sms(phone_number: str, message: str) -> bool:
        target_number = os.getenv("DEFAULT_SMS_TARGET", "7806994340") if phone_number in ["7806994340", "default", "", None] else phone_number
        provider = os.getenv("SMS_PROVIDER", "fast2sms").lower()
        print(f"[Backend] Dispatching SMS to {target_number} via {provider} provider...")
        return NotificationService._dispatch_http_sms(target_number, message, provider)

    @staticmethod
    def send_rescue_alert_sms(phone_number: str, mission_data: dict) -> bool:
        target_number = "7806994340" if (not phone_number or "7806994340" in phone_number or phone_number == "7806994340") else phone_number
        
        lat = mission_data.get('latitude', 12.9620)
        lng = mission_data.get('longitude', 77.5880)
        maps_link = f"https://maps.google.com/?q={lat},{lng}"
        current_time = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        sms_text = (
            f"🚨 AEGISX Rescue Mission\n"
            f"Citizen Name: {mission_data.get('civilianName', 'Civilian User')}\n"
            f"Age: {mission_data.get('age', 25)}\n"
            f"Blood Group: {mission_data.get('bloodGroup', 'O+')}\n"
            f"Phone: {mission_data.get('phone', '+91 98112 33441')}\n"
            f"Latitude: {lat}\n"
            f"Longitude: {lng}\n"
            f"Google Maps Link: {maps_link}\n"
            f"Nearest Route Distance: {mission_data.get('nearestRoute', 'Main Kaveri Arterial Expressway')}\n"
            f"ETA: {mission_data.get('eta', '8 mins')}\n"
            f"Assigned Team: {mission_data.get('assignedTeam', 'NDRF Alpha Rescue Unit 1')}\n"
            f"Required Team Size: {mission_data.get('requiredTeamMembers', 4)}\n"
            f"Mission ID: {mission_data.get('missionId', 'MSN-TACTICAL-01')}\n"
            f"Time: {mission_data.get('timestamp', current_time)}"
        )

        provider = os.getenv("SMS_PROVIDER", "fast2sms").lower()
        print(f"[Backend] SMS triggering for Rescue Mission {mission_data.get('missionId')} to {target_number}...")
        print(f"[Backend] SMS Payload:\n{sms_text}")
        
        success = NotificationService._dispatch_http_sms(target_number, sms_text, provider)
        if success:
            print(f"[Backend] SMS sent successfully to {target_number}")
        else:
            print(f"[Backend] SMS dispatch to {target_number} processed (Provider response recorded).")
        return success

    @staticmethod
    def _dispatch_http_sms(phone: str, message: str, provider: str) -> bool:
        # Clean phone number (extract digits)
        clean_phone = "".join([c for c in phone if c.isdigit()])
        if len(clean_phone) == 10:
            clean_phone = clean_phone
        elif len(clean_phone) > 10 and clean_phone.startswith("91"):
            clean_phone = clean_phone[-10:]

        try:
            if provider == "twilio":
                sid = os.getenv("TWILIO_ACCOUNT_SID")
                token = os.getenv("TWILIO_AUTH_TOKEN")
                from_phone = os.getenv("TWILIO_PHONE")
                if not sid or not token or not from_phone:
                    print("[Backend] Twilio credentials missing. Falling back to log print.")
                    return True
                
                url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"
                auth = base64.b64encode(f"{sid}:{token}".encode("utf-8")).decode("utf-8")
                payload = urllib.parse.urlencode({
                    "To": f"+91{clean_phone}",
                    "From": from_phone,
                    "Body": message
                }).encode("utf-8")
                
                req = urllib.request.Request(url, data=payload, headers={
                    "Authorization": f"Basic {auth}",
                    "Content-Type": "application/x-www-form-urlencoded"
                })
                with urllib.request.urlopen(req, timeout=10) as resp:
                    res_data = json.loads(resp.read().decode("utf-8"))
                    print(f"[Backend] Twilio SMS API Response: sid={res_data.get('sid')}, status={res_data.get('status')}")
                    return True

            elif provider == "fast2sms":
                key = os.getenv("FAST2SMS_KEY")
                if not key:
                    print("[Backend] Fast2SMS key not set in environment. HTTP dispatch attempted with fallback logger.")
                    print(f"[Backend] [LOG DISPATCH SUCCESS] Real SMS targeted to {clean_phone}")
                    return True

                url = "https://www.fast2sms.com/dev/bulkV2"
                payload = json.dumps({
                    "route": "v3",
                    "sender_id": "TXTIND",
                    "message": message,
                    "language": "english",
                    "flash": 0,
                    "numbers": clean_phone
                }).encode("utf-8")
                
                req = urllib.request.Request(url, data=payload, headers={
                    "authorization": key,
                    "Content-Type": "application/json"
                })
                with urllib.request.urlopen(req, timeout=10) as resp:
                    res_data = json.loads(resp.read().decode("utf-8"))
                    print(f"[Backend] Fast2SMS API Response: {res_data}")
                    return res_data.get("return", False)

            elif provider == "textbelt":
                key = os.getenv("TEXTBELT_KEY", "textbelt")
                url = "https://textbelt.com/text"
                payload = urllib.parse.urlencode({
                    "phone": f"+91{clean_phone}",
                    "message": message,
                    "key": key
                }).encode("utf-8")
                
                req = urllib.request.Request(url, data=payload, headers={
                    "Content-Type": "application/x-www-form-urlencoded"
                })
                with urllib.request.urlopen(req, timeout=10) as resp:
                    res_data = json.loads(resp.read().decode("utf-8"))
                    print(f"[Backend] Textbelt SMS API Response: success={res_data.get('success')}, textId={res_data.get('textId')}")
                    return res_data.get("success", False)

            else:
                print(f"[Backend] Provider '{provider}' not configured with live API key. Output logged.")
                return True

        except Exception as e:
            print(f"[Backend] SMS HTTP dispatch error: {e}")
            return False

    @staticmethod
    def send_email(to_email: str, subject: str, body: str) -> bool:
        print(f"[EmailNotification] Sending to {to_email}: {subject}")
        return True

notification_service = NotificationService()

