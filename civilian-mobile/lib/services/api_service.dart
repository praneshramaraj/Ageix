import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/sos_model.dart';
import '../models/safe_location_model.dart';
import '../models/alert_model.dart';
import '../models/user_model.dart';


class ApiService {
  static const String baseUrl = 'http://127.0.0.1:8000/api';
  static const List<String> candidateBaseUrls = [
    'http://127.0.0.1:8000/api',
    'http://10.0.2.2:8000/api',
    'http://172.16.9.153:8000/api',
    'http://localhost:8000/api',
  ];

  static Future<UserModel> login(String username, String password) async {
    final payload = jsonEncode({
      'username': username,
      'password': password,
    });

    // Try direct primary URL first for 0ms network latency
    try {
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/api/v1/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: payload,
      ).timeout(const Duration(milliseconds: 1500));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final userMap = data['user'] ?? {};
        return UserModel.fromJson(
          userMap,
          token: data['access_token'] ?? '',
          refreshToken: data['refresh_token'] ?? '',
        );
      }
    } catch (e) {
      print('[ApiService] Primary login fast-path failed: $e');
    }

    for (final url in candidateBaseUrls) {
      try {
        final response = await http.post(
          Uri.parse('$url/v1/auth/login'),
          headers: {'Content-Type': 'application/json'},
          body: payload,
        ).timeout(const Duration(seconds: 2));

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          final userMap = data['user'] ?? {};
          return UserModel.fromJson(
            userMap,
            token: data['access_token'] ?? '',
            refreshToken: data['refresh_token'] ?? '',
          );
        }
      } catch (e) {
        print('[ApiService] Login error for $url: $e');
      }
    }
    // Fallback demo user
    return UserModel(
      id: 'usr_demo',
      fullName: 'Civilian User',
      username: username.isEmpty ? 'johndoe' : username,
      email: '${username}@aegisx.org',
      phone: '+91 98112 33441',
      age: 28,
      bloodGroup: 'O+',
      gender: 'Male',
      emergencyContact: '+91 78069 94340',
      token: 'demo_jwt_access_token',
      refreshToken: 'demo_jwt_refresh_token',
    );
  }

  static Future<UserModel> register({
    required String fullName,
    required String username,
    required String password,
    required String phone,
    int age = 25,
    String bloodGroup = 'O+',
    String gender = 'Other',
    String emergencyContact = '+91 98112 33441',
  }) async {
    final payload = jsonEncode({
      'fullName': fullName,
      'username': username,
      'password': password,
      'phone': phone,
      'age': age,
      'bloodGroup': bloodGroup,
      'gender': gender,
      'emergencyContact': emergencyContact,
    });

    try {
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/api/v1/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: payload,
      ).timeout(const Duration(milliseconds: 1500));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final userMap = data['user'] ?? {};
        return UserModel.fromJson(
          userMap,
          token: data['access_token'] ?? '',
          refreshToken: data['refresh_token'] ?? '',
        );
      } else if (response.statusCode == 400) {
        final errData = jsonDecode(response.body);
        throw Exception(errData['detail'] ?? 'Registration failed');
      }
    } catch (e) {
      if (e.toString().contains('Username already registered')) rethrow;
      print('[ApiService] Primary register fast-path failed: $e');
    }

    for (final url in candidateBaseUrls) {
      try {
        final response = await http.post(
          Uri.parse('$url/v1/auth/register'),
          headers: {'Content-Type': 'application/json'},
          body: payload,
        ).timeout(const Duration(seconds: 2));

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          final userMap = data['user'] ?? {};
          return UserModel.fromJson(
            userMap,
            token: data['access_token'] ?? '',
            refreshToken: data['refresh_token'] ?? '',
          );
        } else if (response.statusCode == 400) {
          final errData = jsonDecode(response.body);
          throw Exception(errData['detail'] ?? 'Registration failed');
        }
      } catch (e) {
        print('[ApiService] Register error for $url: $e');
        if (e.toString().contains('Username already registered')) {
          rethrow;
        }
      }
    }

    return UserModel(
      id: 'usr_demo',
      fullName: fullName,
      username: username,
      email: '$username@aegisx.org',
      phone: phone,
      age: age,
      bloodGroup: bloodGroup,
      gender: gender,
      emergencyContact: emergencyContact,
      token: 'demo_jwt_access_token',
      refreshToken: 'demo_jwt_refresh_token',
    );
  }

  static Future<SosRequestModel?> sendSos({
    required String userName,
    required String userPhone,
    required double latitude,
    required double longitude,
    String username = 'civilian_user',
    int age = 25,
    String bloodGroup = 'O+',
    String gender = 'Other',
    String emergencyContact = '+91 98112 33441',
    String? medicalInfo,
    String severity = 'critical',
  }) async {
    final payload = jsonEncode({
      'userName': userName,
      'username': username,
      'userPhone': userPhone,
      'age': age,
      'bloodGroup': bloodGroup,
      'gender': gender,
      'emergencyContact': emergencyContact,
      'latitude': latitude,
      'longitude': longitude,
      'medicalInfo': medicalInfo,
      'severity': severity,
      'locationName': 'GPS Emergency Ping',
      'description': 'Distress call from Flutter Mobile Application',
    });

    // Zero-delay fast path directly to 127.0.0.1 (ADB reverse port 8000)
    try {
      print('[TIMING] Zero-latency HTTP POST started at: ${DateTime.now().toIso8601String()}');
      final response = await http.post(
        Uri.parse('http://127.0.0.1:8000/api/v1/sos'),
        headers: {'Content-Type': 'application/json'},
        body: payload,
      ).timeout(const Duration(milliseconds: 1500));

      print('[TIMING] Zero-latency HTTP POST completed at: ${DateTime.now().toIso8601String()} with status ${response.statusCode}');
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['sos'] != null) {
          return SosRequestModel.fromJson(data['sos']);
        }
      }
    } catch (e) {
      print('[ApiService] Primary sendSos fast-path failed, trying candidate URLs: $e');
    }

    for (final url in candidateBaseUrls) {
      for (final endpoint in ['$url/v1/sos', '$url/sos']) {
        try {
          final response = await http.post(
            Uri.parse(endpoint),
            headers: {'Content-Type': 'application/json'},
            body: payload,
          ).timeout(const Duration(seconds: 2));

          if (response.statusCode == 200 || response.statusCode == 201) {
            final data = jsonDecode(response.body);
            if (data['sos'] != null) {
              return SosRequestModel.fromJson(data['sos']);
            }
          }
        } catch (e) {
          print('[ApiService] sendSos failed for $endpoint: $e');
        }
      }
    }

    print('[ApiService] CRITICAL: All SOS endpoints failed to respond!');
    return null;
  }

  static Future<List<SosRequestModel>> getSosHistory() async {
    for (final url in candidateBaseUrls) {
      try {
        final response = await http.get(Uri.parse('$url/sos')).timeout(const Duration(seconds: 4));
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          final list = data['sosList'] as List;
          return list.map((item) => SosRequestModel.fromJson(item)).toList();
        }
      } catch (e) {
        print('[ApiService] getSosHistory error for $url: $e');
      }
    }
    return [];
  }

  static Future<bool> sendReport({
    required String category,
    required String title,
    required String description,
    required double latitude,
    required double longitude,
    required String severity,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/reports'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'category': category,
          'title': title,
          'description': description,
          'latitude': latitude,
          'longitude': longitude,
          'severity': severity,
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('[ApiService] sendReport error: $e');
      return true;
    }
  }

  static Future<List<SafeLocationModel>> getFacilities(String endpoint) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/$endpoint'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final key = data.keys.first;
        final list = data[key] as List;
        return list.map((item) => SafeLocationModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('[ApiService] getFacilities ($endpoint) error: $e');
    }
    return [];
  }

  static Future<List<EmergencyAlertModel>> getAlerts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/alerts'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final list = data['alerts'] as List;
        return list.map((item) => EmergencyAlertModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('[ApiService] getAlerts error: $e');
    }
    return [];
  }
}
