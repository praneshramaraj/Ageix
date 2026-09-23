import 'package:flutter/material.dart';
import '../models/alert_model.dart';
import '../services/api_service.dart';

class AlertProvider with ChangeNotifier {
  List<EmergencyAlertModel> _alerts = [];
  bool _isLoading = false;

  List<EmergencyAlertModel> get alerts => _alerts;
  bool get isLoading => _isLoading;

  AlertProvider() {
    fetchAlerts();
  }

  Future<void> fetchAlerts() async {
    _isLoading = true;
    notifyListeners();

    _alerts = await ApiService.getAlerts();

    if (_alerts.isEmpty) {
      _alerts = [
        EmergencyAlertModel(
          id: 'alt_1',
          title: 'RED ALERT: Flash Flood Evacuation Order',
          category: 'Evacuation',
          severity: 'CRITICAL',
          message:
              'All residents within 500m of Kaveri River must move to designated shelters immediately.',
          issuedBy: 'State Disaster Management Authority',
          timestamp: '20 mins ago',
        ),
        EmergencyAlertModel(
          id: 'alt_2',
          title: 'Heavy Rainfall & Cyclone Warning',
          category: 'Weather',
          severity: 'HIGH',
          message:
              'Rainfall exceeding 120mm forecasted over next 6 hours. Expect power outages.',
          issuedBy: 'Meteorological Department',
          timestamp: '1 hour ago',
        ),
      ];
    }

    _isLoading = false;
    notifyListeners();
  }
}
