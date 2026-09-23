import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _selectedLang = 'English';
  bool _darkMode = true;
  bool _lowBatteryMode = false;
  bool _shareLocation = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07161E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF10232C),
        title: const Text('App Settings & Preferences', style: TextStyle(color: Colors.white)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ListTile(
            tileColor: const Color(0xFF10232C),
            leading: const Icon(Icons.language, color: Color(0xFF00D4FF)),
            title: const Text('Application Language', style: TextStyle(color: Colors.white)),
            trailing: DropdownButton<String>(
              value: _selectedLang,
              dropdownColor: const Color(0xFF10232C),
              style: const TextStyle(color: Color(0xFF00D4FF)),
              items: ['English', 'Spanish', 'Hindi', 'French', 'Bengali']
                  .map((l) => DropdownMenuItem(value: l, child: Text(l)))
                  .toList(),
              onChanged: (v) => setState(() => _selectedLang = v!),
            ),
          ),
          const SizedBox(height: 8),
          SwitchListTile(
            tileColor: const Color(0xFF10232C),
            activeColor: const Color(0xFF00D4FF),
            secondary: const Icon(Icons.dark_mode, color: Color(0xFF00D4FF)),
            title: const Text('Dark Emergency Theme', style: TextStyle(color: Colors.white)),
            value: _darkMode,
            onChanged: (v) => setState(() => _darkMode = v),
          ),
          const SizedBox(height: 8),
          SwitchListTile(
            tileColor: const Color(0xFF10232C),
            activeColor: const Color(0xFF3DDC84),
            secondary: const Icon(Icons.battery_saver, color: Color(0xFF3DDC84)),
            title: const Text('Low Battery Saver Mode', style: TextStyle(color: Colors.white)),
            value: _lowBatteryMode,
            onChanged: (v) => setState(() => _lowBatteryMode = v),
          ),
          const SizedBox(height: 8),
          SwitchListTile(
            tileColor: const Color(0xFF10232C),
            activeColor: const Color(0xFF00D4FF),
            secondary: const Icon(Icons.location_on, color: Color(0xFF00D4FF)),
            title: const Text('Live GPS Location Sharing', style: TextStyle(color: Colors.white)),
            value: _shareLocation,
            onChanged: (v) => setState(() => _shareLocation = v),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Offline map cache & tiles cleared successfully.')),
              );
            },
            icon: const Icon(Icons.cleaning_services),
            label: const Text('CLEAR LOCAL MAP CACHE'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1E3440),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ],
      ),
    );
  }
}
