import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/offline_provider.dart';

class OfflineQueueScreen extends StatelessWidget {
  const OfflineQueueScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final offline = Provider.of<OfflineProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF07161E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF10232C),
        title: const Text('Offline Queue & Tile Cache', style: TextStyle(color: Colors.white)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF10232C),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF1E3440)),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Icon(
                        offline.isOnline ? Icons.wifi : Icons.wifi_off,
                        color: offline.isOnline ? const Color(0xFF3DDC84) : const Color(0xFFFF4D4D),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'NETWORK STATUS: ${offline.isOnline ? "ONLINE" : "OFFLINE QUEUE MODE"}',
                        style: TextStyle(
                          color: offline.isOnline ? const Color(0xFF3DDC84) : const Color(0xFFFF4D4D),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Queued Requests Pending Auto-Sync: ${offline.totalQueued}',
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: offline.totalQueued == 0 || offline.isSyncing ? null : () => offline.syncOfflineData(),
              icon: offline.isSyncing
                  ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Icon(Icons.sync),
              label: Text(offline.isSyncing ? 'SYNCING DATA...' : 'FORCE SYNC QUEUE TO FASTAPI'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00D4FF),
                foregroundColor: const Color(0xFF07161E),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
            const SizedBox(height: 24),
            const Text('QUEUED ITEMS', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Expanded(
              child: offline.totalQueued == 0
                  ? const Center(
                      child: Text('No offline items in queue.', style: TextStyle(color: Color(0xFFAAB6C3))),
                    )
                  : ListView(
                      children: [
                        ...offline.queuedSos.map((s) => ListTile(
                              tileColor: const Color(0xFF10232C),
                              leading: const Icon(Icons.sos, color: Colors.redAccent),
                              title: Text('SOS Request: ${s['userName']}', style: const TextStyle(color: Colors.white)),
                              subtitle: Text('Lat: ${s['latitude']}, Lng: ${s['longitude']}',
                                  style: const TextStyle(color: Color(0xFFAAB6C3))),
                            )),
                        ...offline.queuedReports.map((r) => ListTile(
                              tileColor: const Color(0xFF10232C),
                              leading: const Icon(Icons.report, color: Color(0xFFFFB000)),
                              title: Text('Report: ${r['title']}', style: const TextStyle(color: Colors.white)),
                              subtitle: Text('Category: ${r['category']}',
                                  style: const TextStyle(color: Color(0xFFAAB6C3))),
                            )),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
