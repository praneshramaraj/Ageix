class UserModel {
  final String id;
  final String fullName;
  final String username;
  final String email;
  final String phone;
  final int age;
  final String bloodGroup;
  final String gender;
  final String emergencyContact;
  final String medicalNotes;
  final String token;
  final String refreshToken;

  UserModel({
    required this.id,
    required this.fullName,
    required this.username,
    required this.email,
    required this.phone,
    this.age = 25,
    this.bloodGroup = 'O+',
    this.gender = 'Other',
    this.emergencyContact = '+91 98112 33441',
    this.medicalNotes = 'None',
    this.token = '',
    this.refreshToken = '',
  });

  factory UserModel.fromJson(
    Map<String, dynamic> json, {
    String token = '',
    String refreshToken = '',
  }) {
    return UserModel(
      id: json['id'] ?? 'usr_demo',
      fullName: json['fullName'] ?? json['full_name'] ?? 'Civilian User',
      username:
          json['username'] ?? json['email']?.split('@')[0] ?? 'civilian_user',
      email: json['email'] ?? 'civilian@aegisx.org',
      phone: json['phone'] ?? '+91 98112 33441',
      age: json['age'] is int
          ? json['age']
          : (int.tryParse(json['age']?.toString() ?? '25') ?? 25),
      bloodGroup: json['bloodGroup'] ?? json['blood_group'] ?? 'O+',
      gender: json['gender'] ?? 'Other',
      emergencyContact:
          json['emergencyContact'] ??
          json['emergency_contact'] ??
          '+91 98112 33441',
      medicalNotes: json['medicalNotes'] ?? json['medical_notes'] ?? 'None',
      token: token.isNotEmpty ? token : (json['token'] ?? ''),
      refreshToken: refreshToken.isNotEmpty
          ? refreshToken
          : (json['refreshToken'] ?? ''),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'username': username,
      'email': email,
      'phone': phone,
      'age': age,
      'bloodGroup': bloodGroup,
      'gender': gender,
      'emergencyContact': emergencyContact,
      'medicalNotes': medicalNotes,
      'token': token,
      'refreshToken': refreshToken,
    };
  }
}
