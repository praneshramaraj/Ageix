import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:civilian_mobile/providers/auth_provider.dart';
import 'package:civilian_mobile/screens/auth/login_screen.dart';

void main() {
  testWidgets('Civilian App login screen smoke test', (WidgetTester tester) async {
    final authProvider = AuthProvider();
    await tester.pumpWidget(
      ChangeNotifierProvider<AuthProvider>.value(
        value: authProvider,
        child: const MaterialApp(
          home: LoginScreen(),
        ),
      ),
    );

    expect(find.byType(LoginScreen), findsOneWidget);
    await tester.pump();
  });
}
