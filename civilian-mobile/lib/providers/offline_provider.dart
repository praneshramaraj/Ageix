import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import '../services/offline_queue_service.dart';
import '../services/api_service.dart';

class OfflineProvider with ChangeNotifier {
  bool _isOnline = true;
  List<Map<String, dynamic>> _queuedSos = [];
  List<Map<String, dynamic>> _queuedReports = [];
  bool _isSyncing = false;
  StreamSubscription<List<ConnectivityResult>>? _connectivitySubscription;

  bool get isOnline => _isOnline;
  List<Map<String, dynamic>> get queuedSos => _queuedSos;
  List<Map<String, dynamic>> get queuedReports => _queuedReports;
  bool get isSyncing => _isSyncing;
  int get totalQueued => _queuedSos.length + _queuedReports.length;

  OfflineProvider() {
    _initConnectivityListener();
    loadQueues();
  }

  void _initConnectivityListener() {
    _connectivitySubscription = Connectivity().onConnectivityChanged.listen((
      results,
    ) {
      final isConnected = results.any((r) => r != ConnectivityResult.none);
      final wasOffline = !_isOnline;
      _isOnline = isConnected;
      notifyListeners();

      if (wasOffline && _isOnline) {
        syncOfflineData();
      }
    });
  }

  void toggleNetworkStatus() {
    _isOnline = !_isOnline;
    notifyListeners();
    if (_isOnline) {
      syncOfflineData();
    }
  }

  Future<void> loadQueues() async {
    _queuedSos = await OfflineQueueService.getQueuedSos();
    _queuedReports = await OfflineQueueService.getQueuedReports();
    notifyListeners();
  }

  Future<void> syncOfflineData() async {
    if (_isSyncing || totalQueued == 0 || !_isOnline) return;
    _isSyncing = true;
    notifyListeners();

    final sosCopy = List<Map<String, dynamic>>.from(_queuedSos);
    for (final sos in sosCopy) {
      try {
        await ApiService.sendSos(
          userName: sos['userName'] ?? 'Civilian',
          username: sos['username'] ?? 'civilian_user',
          userPhone: sos['userPhone'] ?? '',
          age: sos['age'] is int ? sos['age'] : 25,
          bloodGroup: sos['bloodGroup'] ?? 'O+',
          gender: sos['gender'] ?? 'Other',
          emergencyContact: sos['emergencyContact'] ?? '',
          latitude: (sos['latitude'] as num).toDouble(),
          longitude: (sos['longitude'] as num).toDouble(),
          medicalInfo: sos['medicalInfo'],
          severity: sos['severity'] ?? 'critical',
          disasterType: sos['disasterType'] ?? 'Emergency',
          locationName: sos['locationName'] ?? 'Queued Offline SOS',
        );
      } catch (_) {}
    }
    await OfflineQueueService.clearSosQueue();

    final reportCopy = List<Map<String, dynamic>>.from(_queuedReports);
    for (final report in reportCopy) {
      try {
        await ApiService.sendReport(
          category: report['category'] ?? 'Flood',
          title: report['title'] ?? 'Offline Report',
          description: report['description'] ?? '',
          latitude: (report['latitude'] as num).toDouble(),
          longitude: (report['longitude'] as num).toDouble(),
          severity: report['severity'] ?? 'high',
        );
      } catch (_) {}
    }
    await OfflineQueueService.clearReportQueue();

    await loadQueues();
    _isSyncing = false;
    notifyListeners();
  }

  @override
  void dispose() {
    _connectivitySubscription?.cancel();
    super.dispose();
  }
}
