import 'package:flutter/material.dart';
import '../services/offline_queue_service.dart';
import '../services/api_service.dart';

class OfflineProvider with ChangeNotifier {
  bool _isOnline = true;
  List<Map<String, dynamic>> _queuedSos = [];
  List<Map<String, dynamic>> _queuedReports = [];
  bool _isSyncing = false;

  bool get isOnline => _isOnline;
  List<Map<String, dynamic>> get queuedSos => _queuedSos;
  List<Map<String, dynamic>> get queuedReports => _queuedReports;
  bool get isSyncing => _isSyncing;
  int get totalQueued => _queuedSos.length + _queuedReports.length;

  OfflineProvider() {
    loadQueues();
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
    if (_isSyncing || totalQueued == 0) return;
    _isSyncing = true;
    notifyListeners();

    for (final sos in _queuedSos) {
      await ApiService.sendSos(
        userName: sos['userName'] ?? 'Civilian',
        userPhone: sos['userPhone'] ?? '',
        latitude: (sos['latitude'] as num).toDouble(),
        longitude: (sos['longitude'] as num).toDouble(),
        medicalInfo: sos['medicalInfo'],
      );
    }
    await OfflineQueueService.clearSosQueue();

    for (final report in _queuedReports) {
      await ApiService.sendReport(
        category: report['category'] ?? 'Flood',
        title: report['title'] ?? 'Offline Report',
        description: report['description'] ?? '',
        latitude: (report['latitude'] as num).toDouble(),
        longitude: (report['longitude'] as num).toDouble(),
        severity: report['severity'] ?? 'high',
      );
    }
    await OfflineQueueService.clearReportQueue();

    await loadQueues();
    _isSyncing = false;
    notifyListeners();
  }
}
