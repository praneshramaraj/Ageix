class SafeLocationModel {
  final String id;
  final String name;
  final String type; // shelter, hospital, police, fire
  final String address;
  final double latitude;
  final double longitude;
  final int? capacity;
  final int? occupied;
  final String status;
  final String contactPhone;

  SafeLocationModel({
    required this.id,
    required this.name,
    required this.type,
    required this.address,
    required this.latitude,
    required this.longitude,
    this.capacity,
    this.occupied,
    required this.status,
    required this.contactPhone,
  });

  factory SafeLocationModel.fromJson(Map<String, dynamic> json) {
    return SafeLocationModel(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Safe Facility',
      type: json['type'] ?? 'shelter',
      address: json['address'] ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 12.9620,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 77.5880,
      capacity: json['capacity'],
      occupied: json['occupied'],
      status: json['status'] ?? 'OPEN',
      contactPhone: json['contactPhone'] ?? '112',
    );
  }
}
