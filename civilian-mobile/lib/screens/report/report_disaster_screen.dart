import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/report_provider.dart';
import '../../providers/offline_provider.dart';

class ReportDisasterScreen extends StatefulWidget {
  const ReportDisasterScreen({super.key});

  @override
  State<ReportDisasterScreen> createState() => _ReportDisasterScreenState();
}

class _ReportDisasterScreenState extends State<ReportDisasterScreen> {
  final _formKey = GlobalKey<FormState>();
  String _selectedCategory = 'Flood';
  String _severity = 'critical';
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  bool _attachedPhoto = false;

  final List<String> _categories = [
    'Flood',
    'Fire',
    'Landslide',
    'Earthquake',
    'Cyclone',
    'Building Collapse',
    'Road Block',
    'Tree Down',
    'Power Outage',
    'Water/Food Shortage',
    'Missing Person',
  ];

  void _submit() async {
    if (_formKey.currentState!.validate()) {
      final reportProv = Provider.of<ReportProvider>(context, listen: false);
      final offline = Provider.of<OfflineProvider>(context, listen: false);

      final ok = await reportProv.submitReport(
        category: _selectedCategory,
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        latitude: 12.9620,
        longitude: 77.5880,
        severity: _severity,
        isOnline: offline.isOnline,
      );

      if (ok && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Disaster Report Submitted to Rescue Command Center!',
            ),
            backgroundColor: Color(0xFF3DDC84),
          ),
        );
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final reportProv = Provider.of<ReportProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF07161E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF10232C),
        title: const Text(
          'Report Local Hazard',
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                DropdownButtonFormField<String>(
                  value: _selectedCategory,
                  dropdownColor: const Color(0xFF10232C),
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Hazard Category',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(Icons.category, color: Color(0xFF00D4FF)),
                  ),
                  items: _categories
                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (v) => setState(() => _selectedCategory = v!),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _titleController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Headline / Summary',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(Icons.title, color: Color(0xFF00D4FF)),
                  ),
                  validator: (v) => v!.isEmpty ? 'Enter summary' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _descController,
                  maxLines: 3,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Detailed Observations',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(
                      Icons.description,
                      color: Color(0xFF00D4FF),
                    ),
                  ),
                  validator: (v) => v!.isEmpty ? 'Enter details' : null,
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _severity,
                  dropdownColor: const Color(0xFF10232C),
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Severity Rating',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(Icons.warning, color: Color(0xFFFFB000)),
                  ),
                  items: ['low', 'medium', 'high', 'critical']
                      .map(
                        (s) => DropdownMenuItem(
                          value: s,
                          child: Text(s.toUpperCase()),
                        ),
                      )
                      .toList(),
                  onChanged: (v) => setState(() => _severity = v!),
                ),
                const SizedBox(height: 20),
                OutlinedButton.icon(
                  onPressed: () =>
                      setState(() => _attachedPhoto = !_attachedPhoto),
                  icon: Icon(
                    _attachedPhoto ? Icons.check_circle : Icons.camera_alt,
                    color: _attachedPhoto
                        ? const Color(0xFF3DDC84)
                        : const Color(0xFF00D4FF),
                  ),
                  label: Text(
                    _attachedPhoto
                        ? 'Photo Attached (Simulated)'
                        : 'Attach Photo / Video',
                    style: TextStyle(
                      color: _attachedPhoto
                          ? const Color(0xFF3DDC84)
                          : const Color(0xFF00D4FF),
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(
                      color: _attachedPhoto
                          ? const Color(0xFF3DDC84)
                          : const Color(0xFF00D4FF),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: reportProv.isSubmitting ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFFB000),
                    foregroundColor: const Color(0xFF07161E),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text(
                    'SUBMIT DISASTER REPORT',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
