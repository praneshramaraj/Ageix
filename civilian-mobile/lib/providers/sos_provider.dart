import 'package:flutter/material.dart';
import '../models/sos_model.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';
import '../services/offline_queue_service.dart';

class SosProvider with ChangeNotifier {
  List<SosRequestModel> _sosHistory = [];
  bool _isSending = false;
  bool _isWsConnected = false;
  SosRequestModel? _activeSos;
  final WebSocketService _wsService = WebSocketService();

  List<SosRequestModel> get sosHistory => _sosHistory;
  bool get isSending => _isSending;
  bool get isWsConnected => _isWsConnected;
  SosRequestModel? get activeSos => _activeSos;

  SosProvider() {
    _initWebSocket();
    fetchHistory();
  }

  void _initWebSocket() {
    _wsService.connect(
      onMessage: _handleWebSocketMessage,
      onStateChange: (connected) {
        _isWsConnected = connected;
        notifyListeners();
      },
    );
  }

  void _handleWebSocketMessage(dynamic data) {
    if (data is! Map) return;

    final String eventType = data['type'] ?? data['event'] ?? '';
    final payload = data['payload'] ?? data['data'];

    if (eventType == 'SOS_STATUS_UPDATED' ||
        eventType == 'MISSION_UPDATED' ||
        eventType == 'TEAM_ASSIGNED') {
      if (payload != null) {
        final String payloadId = payload['id'] ?? payload['sosId'] ?? '';
        final String statusStr =
            payload['status'] ?? payload['missionStatus'] ?? 'En Route';
        final String? teamStr = payload['assignedTeam'] ?? payload['teamName'];
        final String? vehStr = payload['assignedVehicle'] ?? payload['vehicle'];
        final String? etaStr = payload['eta'];
        final String? incStr = payload['incidentId'];

        if (_activeSos != null &&
            (_activeSos!.id == payloadId ||
                payloadId.isEmpty ||
                _activeSos!.id.startsWith('offline_'))) {
          _activeSos = SosRequestModel(
            id: payloadId.isNotEmpty ? payloadId : _activeSos!.id,
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
    String severity = 'critical',
    String disasterType = 'Emergency',
    String locationName = 'Live GPS Distress Ping',
    bool isOnline = true,
  }) async {
    print('[Flutter] SOS button pressed for $userName');
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
      'timestamp': DateTime.now().toIso8601String(),
      'medicalNotes': medicalInfo ?? 'None',
      'medicalInfo': medicalInfo,
      'severity': severity,
      'disasterType': disasterType,
      'locationName': locationName,
      'description': 'Hold-to-confirm emergency SOS from AEGISX Flutter App',
    };

    if (isOnline) {
      try {
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
          severity: severity,
          disasterType: disasterType,
          locationName: locationName,
        );

        if (newSos != null) {
          _activeSos = newSos;
          _sosHistory.insert(0, newSos);
          _wsService.sendSos(sosPayload);
        }
      } catch (e) {
        // Fallback to offline queue if API call threw network error
        await OfflineQueueService.enqueueSos(sosPayload);
        _activeSos = _createOfflineSosModel(sosPayload);
        _sosHistory.insert(0, _activeSos!);
      }
    } else {
      // Offline Enqueue
      await OfflineQueueService.enqueueSos(sosPayload);
      _activeSos = _createOfflineSosModel(sosPayload);
      _sosHistory.insert(0, _activeSos!);
    }

    _isSending = false;
    notifyListeners();
    return true;
  }

  SosRequestModel _createOfflineSosModel(Map<String, dynamic> payload) {
    return SosRequestModel(
      id: 'offline_${DateTime.now().millisecondsSinceEpoch}',
      userName: payload['userName'] ?? 'Civilian',
      userPhone: payload['userPhone'] ?? '',
      latitude: (payload['latitude'] as num).toDouble(),
      longitude: (payload['longitude'] as num).toDouble(),
      medicalInfo: payload['medicalInfo'],
      severity: payload['severity'] ?? 'critical',
      status: 'QUEUED_OFFLINE',
      timestamp: DateTime.now().toIso8601String(),
      locationName: payload['locationName'],
      description: payload['description'],
    );
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
