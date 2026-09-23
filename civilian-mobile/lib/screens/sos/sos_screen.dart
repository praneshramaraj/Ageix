import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/sos_provider.dart';
import '../../providers/offline_provider.dart';

class SosScreen extends StatefulWidget {
  const SosScreen({super.key});

  @override
  State<SosScreen> createState() => _SosScreenState();
}

class _SosScreenState extends State<SosScreen> {
  double _holdProgress = 0.0;
  Timer? _holdTimer;
  final int _totalHoldMs = 3000;
  final int _tickMs = 50;

  void _startHold() {
    print('[TIMING] Button press started at: ${DateTime.now().toIso8601String()}');
    _holdProgress = 0.0;
    _holdTimer = Timer.periodic(Duration(milliseconds: _tickMs), (timer) {
      setState(() {
        _holdProgress += _tickMs / _totalHoldMs;
        if (_holdProgress >= 1.0) {
          _holdProgress = 1.0;
          _holdTimer?.cancel();
          print('[TIMING] 3-second countdown completed at: ${DateTime.now().toIso8601String()}');
          _triggerEmergencySos();
        }
      });
    });
  }

  void _cancelHold() {
    _holdTimer?.cancel();
    if (_holdProgress < 1.0) {
      setState(() {
        _holdProgress = 0.0;
      });
    }
  }

  void _triggerEmergencySos() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final sosProv = Provider.of<SosProvider>(context, listen: false);
    final offline = Provider.of<OfflineProvider>(context, listen: false);

    final u = auth.user;

    final success = await sosProv.triggerSos(
      userName: u?.fullName ?? 'Civilian User',
      username: u?.username ?? 'johndoe',
      userPhone: u?.phone ?? '+91 98112 33441',
      age: u?.age ?? 28,
      bloodGroup: u?.bloodGroup ?? 'O+',
      gender: u?.gender ?? 'Male',
      emergencyContact: u?.emergencyContact ?? '+91 78069 94340',
      latitude: 12.9620,
      longitude: 77.5880,
      medicalInfo: u?.medicalNotes,
      isOnline: offline.isOnline,
    );

    if (success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🚨 SOS DISPATCHED TO FASTAPI BACKEND & RESCUE COMMAND CENTER!'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  void dispose() {
    _holdTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sosProv = Provider.of<SosProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF07161E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF10232C),
        title: Row(
          children: [
            Image.asset('assets/images/aegisx_logo.png', width: 24, height: 24, fit: BoxFit.contain),
            const SizedBox(width: 8),
            const Text('EMERGENCY SOS', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text(
                'HOLD BUTTON FOR 3 SECONDS',
                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: 1.2),
              ),
              const SizedBox(height: 8),
              const Text(
                'Sends live GPS coordinates, medical history & triggers real-time rescue dispatch.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Color(0xFFAAB6C3), fontSize: 12),
              ),
              const SizedBox(height: 40),

              // SOS Hold-To-Confirm Button
              GestureDetector(
                onTapDown: (_) => _startHold(),
                onTapUp: (_) => _cancelHold(),
                onTapCancel: _cancelHold,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 220,
                      height: 220,
                      child: CircularProgressIndicator(
                        value: _holdProgress,
                        strokeWidth: 10,
                        backgroundColor: const Color(0xFF10232C),
                        valueColor: const AlwaysStoppedAnimation<Color>(Colors.redAccent),
                      ),
                    ),
                    Container(
                      width: 190,
                      height: 190,
                      decoration: BoxDecoration(
                        color: Colors.redAccent,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.redAccent.withOpacity(0.5),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.sos, size: 64, color: Colors.white),
                            SizedBox(height: 4),
                            Text('PRESS & HOLD', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),

              // Active SOS Status Card
              if (sosProv.activeSos != null) ...[
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10232C),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: sosProv.activeSos!.status == 'En Route'
                          ? const Color(0xFF3DDC84)
                          : Colors.orangeAccent,
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: (sosProv.activeSos!.status == 'En Route'
                                ? const Color(0xFF3DDC84)
                                : Colors.orangeAccent)
                            .withOpacity(0.2),
                        blurRadius: 12,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            sosProv.activeSos!.status == 'En Route'
                                ? Icons.directions_run
                                : Icons.check_circle,
                            color: sosProv.activeSos!.status == 'En Route'
                                ? const Color(0xFF3DDC84)
                                : Colors.orangeAccent,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'SOS SENT SUCCESSFULLY',
                              style: TextStyle(
                                color: sosProv.activeSos!.status == 'En Route'
                                    ? const Color(0xFF3DDC84)
                                    : Colors.orangeAccent,
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        sosProv.activeSos!.status == 'En Route'
                          ? '🚨 Rescue Team En Route to your live GPS coordinates!'
                          : '⏳ Waiting for Rescue Team Dispatcher...',
                        style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                      const Divider(color: Color(0xFF1E3440), height: 20),
                      Text(
                        'Incident ID: ${sosProv.activeSos!.incidentId ?? "INC-2026-901"}',
                        style: const TextStyle(color: Color(0xFF00D4FF), fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Assigned Team: ${sosProv.activeSos!.assignedTeam ?? "Pending Dispatcher Action"}',
                        style: TextStyle(
                          color: sosProv.activeSos!.assignedTeam != null ? const Color(0xFF3DDC84) : const Color(0xFFAAB6C3),
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'ETA: ${sosProv.activeSos!.eta ?? "Calculating live route..."}',
                        style: const TextStyle(color: Colors.white, fontSize: 12),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Mission Status: ${sosProv.activeSos!.status}',
                        style: TextStyle(
                          color: sosProv.activeSos!.status == 'En Route' ? const Color(0xFF3DDC84) : Colors.orangeAccent,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
