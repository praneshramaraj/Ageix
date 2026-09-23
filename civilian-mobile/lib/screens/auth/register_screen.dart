import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _ageController = TextEditingController(text: '28');
  final _emergencyContactController = TextEditingController(
    text: '+91 78069 94340',
  );
  final _passwordController = TextEditingController();
  final _medicalController = TextEditingController();
  String _selectedBloodGroup = 'O+';
  String _selectedGender = 'Male';

  void _submit() async {
    if (_formKey.currentState!.validate()) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final success = await auth.register(
        fullName: _nameController.text.trim(),
        username: _usernameController.text.trim(),
        password: _passwordController.text.trim(),
        phone: _phoneController.text.trim(),
        age: int.tryParse(_ageController.text.trim()) ?? 25,
        bloodGroup: _selectedBloodGroup,
        gender: _selectedGender,
        emergencyContact: _emergencyContactController.text.trim(),
      );
      if (success && mounted) {
        Navigator.pushReplacementNamed(context, '/home');
      } else if (mounted && auth.errorMessage != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(auth.errorMessage!),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF07161E),
      appBar: AppBar(
        backgroundColor: const Color(0xFF10232C),
        title: const Text(
          'Civilian Registration',
          style: TextStyle(color: Colors.white),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  controller: _nameController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Full Name',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(Icons.person, color: Color(0xFF00D4FF)),
                  ),
                  validator: (v) =>
                      (v == null || v.isEmpty) ? 'Enter full name' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _usernameController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Username',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(
                      Icons.account_circle,
                      color: Color(0xFF00D4FF),
                    ),
                  ),
                  validator: (v) =>
                      (v == null || v.isEmpty) ? 'Enter username' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _phoneController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Phone Number',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(Icons.phone, color: Color(0xFF00D4FF)),
                  ),
                  validator: (v) =>
                      (v == null || v.isEmpty) ? 'Enter phone number' : null,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _ageController,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: 'Age',
                          labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                          prefixIcon: Icon(
                            Icons.cake,
                            color: Color(0xFF00D4FF),
                          ),
                        ),
                        validator: (v) =>
                            (v == null || v.isEmpty) ? 'Enter age' : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedGender,
                        dropdownColor: const Color(0xFF10232C),
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: 'Gender',
                          labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                        ),
                        items: ['Male', 'Female', 'Other']
                            .map(
                              (g) => DropdownMenuItem(value: g, child: Text(g)),
                            )
                            .toList(),
                        onChanged: (v) => setState(() => _selectedGender = v!),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedBloodGroup,
                  dropdownColor: const Color(0xFF10232C),
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Blood Group',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(Icons.bloodtype, color: Color(0xFFFF4D4D)),
                  ),
                  items: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
                      .map((bg) => DropdownMenuItem(value: bg, child: Text(bg)))
                      .toList(),
                  onChanged: (v) => setState(() => _selectedBloodGroup = v!),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _emergencyContactController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Emergency Contact Phone',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(
                      Icons.contact_phone,
                      color: Color(0xFFFF9900),
                    ),
                  ),
                  validator: (v) => (v == null || v.isEmpty)
                      ? 'Enter emergency contact'
                      : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _medicalController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Medical Notes (Allergies, Conditions)',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(
                      Icons.medical_services,
                      color: Color(0xFF00D4FF),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Password',
                    labelStyle: TextStyle(color: Color(0xFFAAB6C3)),
                    prefixIcon: Icon(Icons.lock, color: Color(0xFF00D4FF)),
                  ),
                  validator: (v) =>
                      (v == null || v.length < 6) ? '6+ chars required' : null,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: auth.isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3DDC84),
                    foregroundColor: const Color(0xFF07161E),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: auth.isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Color(0xFF07161E),
                          ),
                        )
                      : const Text(
                          'CREATE ACCOUNT',
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
