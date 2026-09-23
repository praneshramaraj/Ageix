import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class OfflineQueueService {
  static const String keySosQueue = 'offline_sos_queue';
  static const String keyReportQueue = 'offline_report_queue';

  static Future<void> enqueueSos(Map<String, dynamic> sos) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getStringList(keySosQueue) ?? [];
    current.add(jsonEncode(sos));
    await prefs.setStringList(keySosQueue, current);
  }

  static Future<List<Map<String, dynamic>>> getQueuedSos() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(keySosQueue) ?? [];
    return list
        .map((item) => jsonDecode(item) as Map<String, dynamic>)
        .toList();
  }

  static Future<void> clearSosQueue() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(keySosQueue);
  }

  static Future<void> enqueueReport(Map<String, dynamic> report) async {
    final prefs = await SharedPreferences.getInstance();
    final current = prefs.getStringList(keyReportQueue) ?? [];
    current.add(jsonEncode(report));
    await prefs.setStringList(keyReportQueue, current);
  }

  static Future<List<Map<String, dynamic>>> getQueuedReports() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(keyReportQueue) ?? [];
    return list
        .map((item) => jsonDecode(item) as Map<String, dynamic>)
        .toList();
  }

  static Future<void> clearReportQueue() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(keyReportQueue);
  }
}
