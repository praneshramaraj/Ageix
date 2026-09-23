import 'package:flutter/material.dart';
import '../models/sos_model.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';
import '../services/offline_queue_service.dart';

class SosProvider with ChangeNotifier {
  List<SosRequestModel> _sosHistory = [];
  bool _isSending = false;
  SosRequestModel? _activeSos;
  final WebSocketService _wsService = WebSocketService();

  List<SosRequestModel> get sosHistory => _sosHistory;
  bool get isSending => _isSending;
  SosRequestModel? get activeSos => _activeSos;

  SosProvider() {
    _connectWebSocket();
    fetchHistory();
  }

  void _connectWebSocket() {
    final wsUrls = [
      'ws://172.16.9.153:8000/ws/sos',
      'ws://127.0.0.1:8000/ws/sos',
      'ws://10.0.2.2:8000/ws/sos',
      'ws://localhost:8000/ws/sos',
    ];
    for (final url in wsUrls) {
      try {
        _wsService.connect(url, onMessage: _handleWebSocketMessage);
      } catch (e) {
        print('[SosProvider] WS connect attempt for $url: $e');
      }
    }
  }

  void _handleWebSocketMessage(dynamic data) {
    if (data is Map && (data['type'] == 'SOS_STATUS_UPDATED' || data['event'] == 'SOS_STATUS_UPDATED')) {
      final payload = data['payload'];
      if (payload != null) {
        final String payloadId = payload['id'] ?? '';
        final String statusStr = payload['status'] ?? 'En Route';
        final String? teamStr = payload['assignedTeam'];
        final String? vehStr = payload['assignedVehicle'];
        final String? etaStr = payload['eta'];
        final String? incStr = payload['incidentId'];

        if (_activeSos != null) {
          _activeSos = SosRequestModel(
            id: _activeSos!.id,
            userName: _activeSos!.userName,
            userPhone: _activeSos!.userPhone,
            latitude: _activeSos!.latitude,
            longitude: _activeSos!.longitude,
            medicalInfo: _activeSos!.medicalInfo,
            severity: _activeSos!.severity,
            status: statusStr,
            timestamp: _activeSos!.timestamp,
            locationName: _activeSos!.locationName,
            description: _activeSos!.description,
            incidentId: incStr ?? _activeSos!.incidentId,
            assignedTeam: teamStr ?? _activeSos!.assignedTeam,
            assignedVehicle: vehStr ?? _activeSos!.assignedVehicle,
            eta: etaStr ?? _activeSos!.eta,
            missionStatus: statusStr,
          );
        }

        final index = _sosHistory.indexWhere((s) => s.id == payloadId);
        if (index != -1 && _activeSos != null) {
          _sosHistory[index] = _activeSos!;
        }
        notifyListeners();
      }
    }
  }

  Future<void> fetchHistory() async {
    _sosHistory = await ApiService.getSosHistory();
    notifyListeners();
  }

  Future<bool> triggerSos({
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
    bool isOnline = true,
  }) async {
    _isSending = true;
    notifyListeners();

    final sosPayload = {
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
      'severity': 'critical',
      'locationName': 'Sector 4 Flood Zone',
      'description': 'Hold-to-confirm emergency SOS from Flutter App',
    };

    if (isOnline) {
      final newSos = await ApiService.sendSos(
        userName: userName,
        username: username,
        userPhone: userPhone,
        age: age,
        bloodGroup: bloodGroup,
        gender: gender,
        emergencyContact: emergencyContact,
        latitude: latitude,
        longitude: longitude,
        medicalInfo: medicalInfo,
      );

      if (newSos != null) {
        _activeSos = newSos;
        _sosHistory.insert(0, newSos);
        _wsService.sendSos(sosPayload);
      }
    } else {
      // Offline Enqueue
      await OfflineQueueService.enqueueSos(sosPayload);
      final offlineSos = SosRequestModel(
        id: 'offline_${DateTime.now().millisecondsSinceEpoch}',
        userName: userName,
        userPhone: userPhone,
        latitude: latitude,
        longitude: longitude,
        medicalInfo: medicalInfo,
        severity: 'critical',
        status: 'QUEUED_OFFLINE',
        timestamp: DateTime.now().toIso8601String(),
      );
      _activeSos = offlineSos;
      _sosHistory.insert(0, offlineSos);
    }

    _isSending = false;
    notifyListeners();
    return true;
  }

  void cancelSos() {
    _activeSos = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _wsService.dispose();
    super.dispose();
  }
}
