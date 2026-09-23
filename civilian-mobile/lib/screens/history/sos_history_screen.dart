import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/sos_provider.dart';

class SosHistoryScreen extends StatelessWidget {
  const SosHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final sosProv = Provider.of<SosProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF07161E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF10232C),
        title: const Text('SOS Request History', style: TextStyle(color: Colors.white)),
      ),
      body: RefreshIndicator(
        onRefresh: () => sosProv.fetchHistory(),
        child: sosProv.sosHistory.isEmpty
            ? const Center(
                child: Text('No previous SOS requests recorded.', style: TextStyle(color: Color(0xFFAAB6C3))),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: sosProv.sosHistory.length,
                itemBuilder: (context, index) {
                  final item = sosProv.sosHistory[index];
                  final isDispatched = item.status == 'DISPATCHED';

                  return Card(
                    color: const Color(0xFF10232C),
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                      side: const BorderSide(color: Color(0xFF1E3440)),
                    ),
                    child: ListTile(
                      leading: const CircleAvatar(
                        backgroundColor: Colors.redAccent,
                        child: Icon(Icons.sos, color: Colors.white),
                      ),
                      title: Text(
                        'SOS ID: ${item.id}',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Text('Coordinates: ${item.latitude.toStringAsFixed(4)}, ${item.longitude.toStringAsFixed(4)}',
                              style: const TextStyle(color: Color(0xFFAAB6C3), fontSize: 12)),
                          if (item.medicalInfo != null)
                            Text('Medical Note: ${item.medicalInfo}', style: const TextStyle(color: Colors.white70, fontSize: 11)),
                          Text('Time: ${item.timestamp}', style: const TextStyle(color: Color(0xFF00D4FF), fontSize: 11)),
                        ],
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isDispatched
                              ? const Color(0xFF3DDC84).withOpacity(0.2)
                              : const Color(0xFFFFB000).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          item.status,
                          style: TextStyle(
                            color: isDispatched ? const Color(0xFF3DDC84) : const Color(0xFFFFB000),
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
