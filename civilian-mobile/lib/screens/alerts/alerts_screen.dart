import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/alert_provider.dart';

class AlertsScreen extends StatelessWidget {
  const AlertsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final alertProv = Provider.of<AlertProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF07161E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF10232C),
        title: const Text(
          'Government & Weather Alerts',
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: alertProv.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFF00D4FF)),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: alertProv.alerts.length,
              itemBuilder: (context, index) {
                final alt = alertProv.alerts[index];
                final isCritical = alt.severity == 'CRITICAL';
                final color = isCritical
                    ? const Color(0xFFFF4D4D)
                    : const Color(0xFFFFB000);

                return Card(
                  color: const Color(0xFF10232C),
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                    side: BorderSide(color: color, width: 1.5),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.warning, color: color),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                alt.title,
                                style: TextStyle(
                                  color: color,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          alt.message,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Authority: ${alt.issuedBy}',
                              style: const TextStyle(
                                color: Color(0xFFAAB6C3),
                                fontSize: 11,
                              ),
                            ),
                            Text(
                              alt.timestamp,
                              style: const TextStyle(
                                color: Color(0xFF00D4FF),
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
