import 'package:flutter/material.dart';
import '../models/report_model.dart';
import '../services/api_service.dart';
import '../services/offline_queue_service.dart';

class ReportProvider with ChangeNotifier {
  List<DisasterReportModel> _reports = [];
  bool _isSubmitting = false;

  List<DisasterReportModel> get reports => _reports;
  bool get isSubmitting => _isSubmitting;

  ReportProvider() {
    fetchReports();
  }

  Future<void> fetchReports() async {
    _reports = [
      DisasterReportModel(
        id: 'rep_101',
        category: 'Flood',
        title: 'Kaveri River Embankment Overflow',
        description: 'Water level risen 2.5m above danger mark.',
        latitude: 12.9620,
        longitude: 77.5880,
        severity: 'critical',
        status: 'TRIAGED',
        timestamp: '15 mins ago',
      ),
      DisasterReportModel(
        id: 'rep_102',
        category: 'Road Block',
        title: 'Fallen High-Voltage Tree Line',
        description: 'Main access road to general hospital blocked.',
        latitude: 12.9750,
        longitude: 77.6100,
        severity: 'high',
        status: 'ACTION_ASSIGNED',
        timestamp: '40 mins ago',
      ),
    ];
    notifyListeners();
  }

  Future<bool> submitReport({
    required String category,
    required String title,
    required String description,
    required double latitude,
    required double longitude,
    required String severity,
    bool isOnline = true,
  }) async {
    _isSubmitting = true;
    notifyListeners();

    final reportPayload = {
      'category': category,
      'title': title,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
      'severity': severity,
    };

    if (isOnline) {
      await ApiService.sendReport(
        category: category,
        title: title,
        description: description,
        latitude: latitude,
        longitude: longitude,
        severity: severity,
      );
    } else {
      await OfflineQueueService.enqueueReport(reportPayload);
    }

    final newReport = DisasterReportModel(
      id: 'rep_${DateTime.now().millisecondsSinceEpoch}',
      category: category,
      title: title,
      description: description,
      latitude: latitude,
      longitude: longitude,
      severity: severity,
      status: isOnline ? 'REPORTED' : 'QUEUED_OFFLINE',
      timestamp: 'Just now',
    );

    _reports.insert(0, newReport);
    _isSubmitting = false;
    notifyListeners();
    return true;
  }
}
