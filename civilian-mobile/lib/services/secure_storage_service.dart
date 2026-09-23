import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';

class SecureStorageService {
  static const _storage = FlutterSecureStorage();

  static const String _keyAccessToken = 'access_token';
  static const String _keyRefreshToken = 'refresh_token';
  static const String _keyCivilianProfile = 'civilian_profile';

  static Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: _keyAccessToken, value: accessToken);
    await _storage.write(key: _keyRefreshToken, value: refreshToken);
  }

  static Future<String?> getAccessToken() async {
    return await _storage.read(key: _keyAccessToken);
  }

  static Future<String?> getRefreshToken() async {
    return await _storage.read(key: _keyRefreshToken);
  }

  static Future<void> saveUser(UserModel user) async {
    await saveTokens(accessToken: user.token, refreshToken: user.refreshToken);
    await _storage.write(
      key: _keyCivilianProfile,
      value: jsonEncode(user.toJson()),
    );
  }

  static Future<UserModel?> getUser() async {
    final profileJson = await _storage.read(key: _keyCivilianProfile);
    final accessToken = await getAccessToken() ?? '';
    final refreshToken = await getRefreshToken() ?? '';

    if (profileJson != null && profileJson.isNotEmpty) {
      try {
        final Map<String, dynamic> userMap = jsonDecode(profileJson);
        return UserModel.fromJson(
          userMap,
          token: accessToken,
          refreshToken: refreshToken,
        );
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
