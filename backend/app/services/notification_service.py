from typing import List, Optional

class NotificationService:
    @staticmethod
    def send_push_notification(target_users: List[str], title: str, message: str, data: Optional[dict] = None) -> bool:
        print(f"[PushNotification] Sending to {len(target_users)} users: '{title}' - {message}")
        return True

    @staticmethod
    def send_sms(phone_number: str, message: str) -> bool:
        print(f"[SMSNotification] Sending to {phone_number}:\n{message}")
        return True

    @staticmethod
    def send_rescue_alert_sms(phone_number: str, mission_data: dict) -> bool:
        target_number = phone_number or "7806994340"
        sms_text = f"""AEGISX RESCUE ALERT

Mission ID: {mission_data.get('missionId', 'MSN-TACTICAL-01')}
Civilian: {mission_data.get('civilianName', 'Civilian User')}
Age: {mission_data.get('age', 25)}
Blood Group: {mission_data.get('bloodGroup', 'O+')}
Phone: {mission_data.get('phone', '+91 98112 33441')}
Latitude: {mission_data.get('latitude', 12.9620)}
Longitude: {mission_data.get('longitude', 77.5880)}
Nearest Landmark: {mission_data.get('locationName', 'Sector 4 Kaveri Flood Zone')}
Nearest Route: {mission_data.get('nearestRoute', 'Main Kaveri Arterial Expressway')}
Estimated Travel Time: {mission_data.get('eta', '8 mins')}
Required Team Members: {mission_data.get('requiredTeamMembers', 4)}
Priority: {mission_data.get('priority', 'CRITICAL').upper()}"""

        print(f"[SMS GATEWAY] Dispatching SMS to temporary destination: {target_number}")
        print(f"[SMS GATEWAY MESSAGE BODY]:\n{sms_text}")
        return True

    @staticmethod
    def send_email(to_email: str, subject: str, body: str) -> bool:
        print(f"[EmailNotification] Sending to {to_email}: {subject}")
        return True

notification_service = NotificationService()
