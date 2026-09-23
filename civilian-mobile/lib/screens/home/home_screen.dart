import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/offline_provider.dart';
import '../../providers/alert_provider.dart';
import '../sos/sos_screen.dart';
import '../report/report_disaster_screen.dart';
import '../shelters/safe_locations_screen.dart';
import '../alerts/alerts_screen.dart';
import '../offline/offline_queue_screen.dart';
import '../profile/profile_screen.dart';
import '../settings/settings_screen.dart';
import '../history/sos_history_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const CivilianHomeTab(),
    const SosScreen(),
    const ReportDisasterScreen(),
    const SafeLocationsScreen(),
    const AlertsScreen(),
    const SosHistoryScreen(),
    const OfflineQueueScreen(),
    const ProfileScreen(),
    const SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final offline = Provider.of<OfflineProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF07161E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF10232C),
        elevation: 0,
        title: Row(
          children: [
            Image.asset(
              'assets/images/aegisx_logo.png',
              width: 28,
              height: 28,
              fit: BoxFit.contain,
            ),
            const SizedBox(width: 8),
            const Text(
              'AegisX',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            const Spacer(),
            IconButton(
              icon: Icon(
                offline.isOnline ? Icons.wifi : Icons.wifi_off,
                color: offline.isOnline
                    ? const Color(0xFF3DDC84)
                    : const Color(0xFFFF4D4D),
              ),
              onPressed: () {
                offline.toggleNetworkStatus();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      offline.isOnline
                          ? 'Switched to ONLINE mode'
                          : 'Switched to OFFLINE queue mode',
                    ),
                    duration: const Duration(seconds: 2),
                  ),
                );
              },
            ),
          ],
        ),
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex > 4 ? 0 : _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        backgroundColor: const Color(0xFF10232C),
        selectedItemColor: const Color(0xFF00D4FF),
        unselectedItemColor: const Color(0xFFAAB6C3),
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(Icons.sos, color: Colors.red),
            label: 'SOS',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.warning), label: 'Report'),
          BottomNavigationBarItem(
            icon: Icon(Icons.night_shelter),
            label: 'Shelters',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: 'Alerts',
          ),
        ],
      ),
    );
  }
}

class CivilianHomeTab extends StatelessWidget {
  const CivilianHomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final alertProv = Provider.of<AlertProvider>(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Emergency Header Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E3440), Color(0xFF10232C)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFFF4D4D), width: 1.5),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.warning_amber_rounded,
                      color: Color(0xFFFF4D4D),
                      size: 28,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'DISASTER LEVEL 4: FLASH FLOOD WARNING',
                        style: const TextStyle(
                          color: Color(0xFFFF4D4D),
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Welcome, ${auth.user?.fullName ?? 'Civilian'}. Stay vigilant.',
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text(
                      'Weather: 28°C Heavy Rain',
                      style: TextStyle(color: Color(0xFFAAB6C3), fontSize: 12),
                    ),
                    Text(
                      'Rainfall: 110mm/h',
                      style: TextStyle(color: Color(0xFF00D4FF), fontSize: 12),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Main Quick Emergency Action Grid
          const Text(
            'EMERGENCY SHORTCUTS',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.3,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            children: [
              _buildActionCard(
                context,
                title: 'ONE-TAP SOS',
                subtitle: 'Hold for Emergency Rescue',
                icon: Icons.sos,
                color: Colors.redAccent,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const SosScreen()),
                  );
                },
              ),
              _buildActionCard(
                context,
                title: 'REPORT HAZARD',
                subtitle: 'Send Flood/Fire Report',
                icon: Icons.add_location_alt,
                color: const Color(0xFFFFB000),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ReportDisasterScreen(),
                    ),
                  );
                },
              ),
              _buildActionCard(
                context,
                title: 'SAFE SHELTERS',
                subtitle: 'Find Nearby Camps & Hospitals',
                icon: Icons.local_hospital,
                color: const Color(0xFF00D4FF),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const SafeLocationsScreen(),
                    ),
                  );
                },
              ),
              _buildActionCard(
                context,
                title: 'SOS HISTORY',
                subtitle: 'Track Rescue Response',
                icon: Icons.history,
                color: const Color(0xFF3DDC84),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const SosHistoryScreen()),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Emergency Alerts Preview
          const Text(
            'RECENT DISASTER ALERTS',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          ...alertProv.alerts
              .take(2)
              .map(
                (alt) => Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10232C),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFF1E3440)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.campaign, color: Color(0xFFFFB000)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              alt.title,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              alt.message,
                              style: const TextStyle(
                                color: Color(0xFFAAB6C3),
                                fontSize: 11,
                              ),
                              maxLines: 2,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
        ],
      ),
    );
  }

  static Widget _buildActionCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF10232C),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.5)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 36, color: color),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFFAAB6C3), fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }
}
