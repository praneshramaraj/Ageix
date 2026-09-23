class DisasterReportModel {
  final String id;
  final String category;
  final String title;
  final String description;
  final double latitude;
  final double longitude;
  final String severity;
  final String status;
  final String timestamp;

  DisasterReportModel({
    required this.id,
    required this.category,
    required this.title,
    required this.description,
    required this.latitude,
    required this.longitude,
    required this.severity,
    required this.status,
    required this.timestamp,
  });

  factory DisasterReportModel.fromJson(Map<String, dynamic> json) {
    return DisasterReportModel(
      id: json['id'] ?? '',
      category: json['category'] ?? 'Flood',
      title: json['title'] ?? 'Incident Report',
      description: json['description'] ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 12.9620,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 77.5880,
      severity: json['severity'] ?? 'high',
      status: json['status'] ?? 'REPORTED',
      timestamp: json['timestamp'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'category': category,
      'title': title,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
      'severity': severity,
      'status': status,
      'timestamp': timestamp,
    };
  }
}
