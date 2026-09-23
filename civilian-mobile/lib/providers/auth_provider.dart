import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';
import '../services/secure_storage_service.dart';

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
    _isLoading = true;
    notifyListeners();
    try {
      final savedUser = await SecureStorageService.getUser();
      if (savedUser != null && savedUser.token.isNotEmpty) {
        _user = savedUser;
      } else {
        _user = null;
      }
    } catch (e) {
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await ApiService.login(username, password);
      _user = user;
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

  Future<void> logout() async {
    _user = null;
    await SecureStorageService.clearAll();
    notifyListeners();
  }

  Future<void> updateProfile(
    String fullName,
    String phone,
    String bloodGroup,
    String medicalNotes,
  ) async {
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
      await SecureStorageService.saveUser(_user!);
      notifyListeners();
    }
  }
}
