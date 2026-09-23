class EmergencyAlertModel {
  final String id;
  final String title;
  final String category;
  final String severity;
  final String message;
  final String issuedBy;
  final String timestamp;

  EmergencyAlertModel({
    required this.id,
    required this.title,
    required this.category,
    required this.severity,
    required this.message,
    required this.issuedBy,
    required this.timestamp,
  });

  factory EmergencyAlertModel.fromJson(Map<String, dynamic> json) {
    return EmergencyAlertModel(
      id: json['id'] ?? '',
      title: json['title'] ?? 'Emergency Warning',
      category: json['category'] ?? 'General',
      severity: json['severity'] ?? 'HIGH',
      message: json['message'] ?? '',
      issuedBy: json['issuedBy'] ?? 'Disaster Management',
      timestamp: json['timestamp'] ?? '',
    );
  }
}
