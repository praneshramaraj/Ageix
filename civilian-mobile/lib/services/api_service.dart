import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/config/app_config.dart';
import '../models/sos_model.dart';
import '../models/safe_location_model.dart';
import '../models/alert_model.dart';
import '../models/user_model.dart';
import 'secure_storage_service.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class ApiService {
  static final http.Client _client = http.Client();

  static Map<String, String> _buildHeaders({
    String? token,
    bool isJson = true,
  }) {
    final headers = <String, String>{};
    if (isJson) {
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';
    }
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static Future<http.Response> _executeWithRetry(
    Future<http.Response> Function() requestFn, {
    int maxRetries = AppConfig.maxRetries,
  }) async {
    int attempt = 0;
    while (true) {
      try {
        attempt++;
        final response = await requestFn().timeout(AppConfig.connectTimeout);
        return response;
      } catch (e) {
        if (attempt >= maxRetries) {
          if (e is TimeoutException) {
            throw ApiException(
              'Connection timed out. Please check your network connection.',
            );
          }
          throw ApiException('Network failure: ${e.toString()}');
        }
        await Future.delayed(Duration(milliseconds: 500 * attempt));
      }
    }
  }

  static Future<http.Response> _authenticatedRequest(
    Future<http.Response> Function(String token) requestFn,
  ) async {
    String token = await SecureStorageService.getAccessToken() ?? '';
    var response = await _executeWithRetry(() => requestFn(token));

    if (response.statusCode == 401) {
      final refreshed = await refreshToken();
      if (refreshed) {
        token = await SecureStorageService.getAccessToken() ?? '';
        response = await _executeWithRetry(() => requestFn(token));
      } else {
        await SecureStorageService.clearAll();
        throw ApiException(
          'Session expired. Please log in again.',
          statusCode: 401,
        );
      }
    }
    return response;
  }

  // Auth: Login
  static Future<UserModel> login(String username, String password) async {
    final payload = jsonEncode({'username': username, 'password': password});

    final response = await _executeWithRetry(
      () => _client.post(
        Uri.parse('${AppConfig.apiBaseUrl}/auth/login'),
        headers: _buildHeaders(),
        body: payload,
      ),
    );

    if (response.statusCode == 200) {
      final data = _parseJson(response.body);
      final userMap = data['user'] ?? data;
      final accessToken = data['access_token'] ?? data['token'] ?? '';
      final refreshToken = data['refresh_token'] ?? '';

      final user = UserModel.fromJson(
        userMap,
        token: accessToken,
        refreshToken: refreshToken,
      );

      await SecureStorageService.saveUser(user);
      return user;
    } else {
      final errDetail = _extractErrorMessage(response);
      throw ApiException(errDetail, statusCode: response.statusCode);
    }
  }

  // Auth: Register
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

    final response = await _executeWithRetry(
      () => _client.post(
        Uri.parse('${AppConfig.apiBaseUrl}/auth/register'),
        headers: _buildHeaders(),
        body: payload,
      ),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = _parseJson(response.body);
      final userMap = data['user'] ?? data;
      final accessToken = data['access_token'] ?? data['token'] ?? '';
      final refreshToken = data['refresh_token'] ?? '';

      final user = UserModel.fromJson(
        userMap,
        token: accessToken,
        refreshToken: refreshToken,
      );

      await SecureStorageService.saveUser(user);
      return user;
    } else {
      final errDetail = _extractErrorMessage(response);
      throw ApiException(errDetail, statusCode: response.statusCode);
    }
  }

  // Auth: Refresh Token
  static Future<bool> refreshToken() async {
    final savedRefreshToken = await SecureStorageService.getRefreshToken();
    if (savedRefreshToken == null || savedRefreshToken.isEmpty) {
      return false;
    }

    try {
      final response = await _client
          .post(
            Uri.parse('${AppConfig.apiBaseUrl}/auth/refresh'),
            headers: _buildHeaders(),
            body: jsonEncode({'refresh_token': savedRefreshToken}),
          )
          .timeout(AppConfig.connectTimeout);

      if (response.statusCode == 200) {
        final data = _parseJson(response.body);
        final newAccessToken = data['access_token'] ?? '';
        final newRefreshToken = data['refresh_token'] ?? savedRefreshToken;

        if (newAccessToken.isNotEmpty) {
          await SecureStorageService.saveTokens(
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          );
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  // SOS: Trigger Emergency SOS
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
    String disasterType = 'Emergency',
    String locationName = 'GPS Emergency Location',
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
      'timestamp': DateTime.now().toIso8601String(),
      'medicalNotes': medicalInfo ?? 'None',
      'medicalInfo': medicalInfo,
      'severity': severity,
      'disasterType': disasterType,
      'locationName': locationName,
      'description': 'Hold-to-confirm emergency distress call',
    });

    try {
      print('[Flutter] HTTP sent: POST ${AppConfig.apiBaseUrl}/sos');
      final response = await _authenticatedRequest(
        (token) => _client.post(
          Uri.parse('${AppConfig.apiBaseUrl}/sos'),
          headers: _buildHeaders(token: token),
          body: payload,
        ),
      );

      print('[Flutter] Response received: status=${response.statusCode}');
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = _parseJson(response.body);
        final sosJson = data['sos'] ?? data;
        return SosRequestModel.fromJson(sosJson);
      } else {
        throw ApiException(
          _extractErrorMessage(response),
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      print('[Flutter] HTTP error: $e');
      if (e is ApiException) rethrow;
      throw ApiException('Failed to send SOS: ${e.toString()}');
    }
  }


  // SOS: Fetch History
  static Future<List<SosRequestModel>> getSosHistory() async {
    try {
      final response = await _authenticatedRequest(
        (token) => _client.get(
          Uri.parse('${AppConfig.apiBaseUrl}/sos'),
          headers: _buildHeaders(token: token, isJson: false),
        ),
      );

      if (response.statusCode == 200) {
        final data = _parseJson(response.body);
        final List list = data is List
            ? data
            : (data['sosList'] ?? data['history'] ?? []);
        return list.map((item) => SosRequestModel.fromJson(item)).toList();
      }
    } catch (_) {}
    return [];
  }

  // Reports: Submit Disaster Report
  static Future<bool> sendReport({
    required String category,
    required String title,
    required String description,
    required double latitude,
    required double longitude,
    required String severity,
  }) async {
    try {
      final payload = jsonEncode({
        'category': category,
        'title': title,
        'description': description,
        'latitude': latitude,
        'longitude': longitude,
        'severity': severity,
      });

      final response = await _authenticatedRequest(
        (token) => _client.post(
          Uri.parse('${AppConfig.apiBaseUrl}/reports'),
          headers: _buildHeaders(token: token),
          body: payload,
        ),
      );

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  // Facilities & Shelters
  static Future<List<SafeLocationModel>> getFacilities(String endpoint) async {
    try {
      final response = await _executeWithRetry(
        () => _client.get(
          Uri.parse('${AppConfig.apiBaseUrl}/$endpoint'),
          headers: _buildHeaders(isJson: false),
        ),
      );

      if (response.statusCode == 200) {
        final data = _parseJson(response.body);
        final List list = data is List
            ? data
            : (data.values.firstWhere((v) => v is List, orElse: () => [])
                  as List);
        return list.map((item) => SafeLocationModel.fromJson(item)).toList();
      }
    } catch (_) {}
    return [];
  }

  // Emergency Alerts
  static Future<List<EmergencyAlertModel>> getAlerts() async {
    try {
      final response = await _executeWithRetry(
        () => _client.get(
          Uri.parse('${AppConfig.apiBaseUrl}/alerts'),
          headers: _buildHeaders(isJson: false),
        ),
      );

      if (response.statusCode == 200) {
        final data = _parseJson(response.body);
        final List list = data is List ? data : (data['alerts'] ?? []);
        return list.map((item) => EmergencyAlertModel.fromJson(item)).toList();
      }
    } catch (_) {}
    return [];
  }

  static dynamic _parseJson(String source) {
    try {
      return jsonDecode(source);
    } catch (e) {
      throw ApiException('Invalid JSON response format from server');
    }
  }

  static String _extractErrorMessage(http.Response response) {
    try {
      final data = jsonDecode(response.body);
      if (data is Map) {
        return data['detail'] ??
            data['message'] ??
            data['error'] ??
            'Server error (${response.statusCode})';
      }
    } catch (_) {}
    return 'Server returned status ${response.statusCode}';
  }
}
