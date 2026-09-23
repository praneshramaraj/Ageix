class SosRequestModel {
  final String id;
  final String userName;
  final String userPhone;
  final double latitude;
  final double longitude;
  final String? medicalInfo;
  final String severity;
  final String status;
  final String timestamp;
  final String? locationName;
  final String? description;
  final String? incidentId;
  final String? assignedTeam;
  final String? assignedVehicle;
  final String? eta;
  final String? missionStatus;

  SosRequestModel({
    required this.id,
    required this.userName,
    required this.userPhone,
    required this.latitude,
    required this.longitude,
    this.medicalInfo,
    required this.severity,
    required this.status,
    required this.timestamp,
    this.locationName,
    this.description,
    this.incidentId,
    this.assignedTeam,
    this.assignedVehicle,
    this.eta,
    this.missionStatus,
  });

  factory SosRequestModel.fromJson(Map<String, dynamic> json) {
    return SosRequestModel(
      id: json['id'] ?? '',
      userName: json['userName'] ?? 'Civilian',
      userPhone: json['userPhone'] ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 12.9620,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 77.5880,
      medicalInfo: json['medicalInfo'],
      severity: json['severity'] ?? 'critical',
      status: json['status'] ?? 'Waiting for Dispatcher',
      timestamp: json['timestamp'] ?? '',
      locationName: json['locationName'],
      description: json['description'],
      incidentId: json['incidentId'],
      assignedTeam: json['assignedTeam'],
      assignedVehicle: json['assignedVehicle'],
      eta: json['eta'],
      missionStatus: json['missionStatus'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userName': userName,
      'userPhone': userPhone,
      'latitude': latitude,
      'longitude': longitude,
      'medicalInfo': medicalInfo,
      'severity': severity,
      'status': status,
      'timestamp': timestamp,
      'locationName': locationName,
      'description': description,
      'incidentId': incidentId,
      'assignedTeam': assignedTeam,
      'assignedVehicle': assignedVehicle,
      'eta': eta,
      'missionStatus': missionStatus,
    };
  }
}

