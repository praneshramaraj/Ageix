import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    autoLogin();
  }

  Future<void> autoLogin() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      final userJsonStr = prefs.getString('user_data');

      if (token != null && token.isNotEmpty && userJsonStr != null) {
        final Map<String, dynamic> userMap = jsonDecode(userJsonStr);
        _user = UserModel.fromJson(userMap, token: token, refreshToken: prefs.getString('refresh_token') ?? '');
        notifyListeners();
      } else {
        // Fallback default demo user if no saved session
        _user = UserModel(
          id: 'usr_demo',
          fullName: 'John Doe (Civilian)',
          username: 'johndoe',
          email: 'civilian@aegisx.org',
          phone: '+91 98112 33441',
          age: 28,
          bloodGroup: 'O+',
          gender: 'Male',
          emergencyContact: '+91 78069 94340',
          medicalNotes: 'Asthma, Penicillin Allergy',
          token: 'demo_token_123',
        );
        notifyListeners();
      }
    } catch (e) {
      print('[AuthProvider] autoLogin error: $e');
    }
  }

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await ApiService.login(username, password);
      _user = user;
      await _saveSession(user);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String fullName,
    required String username,
    required String password,
    required String phone,
    int age = 25,
    String bloodGroup = 'O+',
    String gender = 'Other',
    String emergencyContact = '+91 98112 33441',
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await ApiService.register(
        fullName: fullName,
        username: username,
        password: password,
        phone: phone,
        age: age,
        bloodGroup: bloodGroup,
        gender: gender,
        emergencyContact: emergencyContact,
      );
      _user = user;
      await _saveSession(user);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> _saveSession(UserModel user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', user.token);
    await prefs.setString('refresh_token', user.refreshToken);
    await prefs.setString('user_data', jsonEncode(user.toJson()));
  }

  Future<void> logout() async {
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('refresh_token');
    await prefs.remove('user_data');
    notifyListeners();
  }

  void updateProfile(String fullName, String phone, String bloodGroup, String medicalNotes) {
    if (_user != null) {
      _user = UserModel(
        id: _user!.id,
        fullName: fullName,
        username: _user!.username,
        email: _user!.email,
        phone: phone,
        age: _user!.age,
        bloodGroup: bloodGroup,
        gender: _user!.gender,
        emergencyContact: _user!.emergencyContact,
        medicalNotes: medicalNotes,
        token: _user!.token,
        refreshToken: _user!.refreshToken,
      );
      _saveSession(_user!);
      notifyListeners();
    }
  }
}

