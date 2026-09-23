import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _medicalController;
  String _bloodGroup = 'O+';

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    _nameController = TextEditingController(text: user?.fullName ?? 'John Doe');
    _phoneController = TextEditingController(text: user?.phone ?? '+91 98112 33441');
    _medicalController = TextEditingController(text: user?.medicalNotes ?? 'Asthma, Penicillin Allergy');
    _bloodGroup = user?.bloodGroup ?? 'O+';
  }

  void _save() {
    Provider.of<AuthProvider>(context, listen: false).updateProfile(
      _nameController.text.trim(),
      _phoneController.text.trim(),
      _bloodGroup,
      _medicalController.text.trim(),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Medical profile updated successfully')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF07161E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF10232C),
        title: const Text('Medical & Personal Profile', style: TextStyle(color: Colors.white)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const CircleAvatar(
                radius: 40,
                backgroundColor: Color(0xFF00D4FF),
                child: Icon(Icons.person, size: 48, color: Color(0xFF07161E)),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _nameController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                  prefixIcon: Icon(Icons.person, color: Color(0xFF00D4FF)),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _phoneController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Emergency Phone',
                  labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                  prefixIcon: Icon(Icons.phone, color: Color(0xFF00D4FF)),
                ),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _bloodGroup,
                dropdownColor: const Color(0xFF10232C),
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Blood Group',
                  labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                  prefixIcon: Icon(Icons.bloodtype, color: Colors.redAccent),
                ),
                items: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
                    .map((b) => DropdownMenuItem(value: b, child: Text(b)))
                    .toList(),
                onChanged: (v) => setState(() => _bloodGroup = v!),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _medicalController,
                maxLines: 2,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Critical Medical Conditions & Allergies',
                  labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                  prefixIcon: Icon(Icons.medical_services, color: Color(0xFF00D4FF)),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3DDC84),
                  foregroundColor: const Color(0xFF07161E),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('SAVE PROFILE PARAMETERS', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
