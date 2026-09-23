import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// Providers
import 'providers/auth_provider.dart';
import 'providers/sos_provider.dart';
import 'providers/report_provider.dart';
import 'providers/safe_locations_provider.dart';
import 'providers/alert_provider.dart';
import 'providers/offline_provider.dart';

// Screens
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/sos/sos_screen.dart';
import 'screens/report/report_disaster_screen.dart';
import 'screens/shelters/safe_locations_screen.dart';
import 'screens/alerts/alerts_screen.dart';
import 'screens/offline/offline_queue_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/history/sos_history_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AegisxCivilianApp());
}

class AegisxCivilianApp extends StatelessWidget {
  const AegisxCivilianApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => SosProvider()),
        ChangeNotifierProvider(create: (_) => ReportProvider()),
        ChangeNotifierProvider(create: (_) => SafeLocationsProvider()),
        ChangeNotifierProvider(create: (_) => AlertProvider()),
        ChangeNotifierProvider(create: (_) => OfflineProvider()),
      ],
      child: MaterialApp(
        title: 'AegisX',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          brightness: Brightness.dark,
          scaffoldBackgroundColor: const Color(0xFF07161E),
          primaryColor: const Color(0xFF00D4FF),
          colorScheme: const ColorScheme.dark(
            primary: Color(0xFF00D4FF),
            secondary: Color(0xFF3DDC84),
            error: Color(0xFFFF4D4D),
            surface: Color(0xFF10232C),
          ),
          fontFamily: 'Roboto',
        ),
        initialRoute: '/home',
        routes: {
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/home': (context) => const HomeScreen(),
          '/sos': (context) => const SosScreen(),
          '/report': (context) => const ReportDisasterScreen(),
          '/shelters': (context) => const SafeLocationsScreen(),
          '/alerts': (context) => const AlertsScreen(),
          '/offline': (context) => const OfflineQueueScreen(),
          '/profile': (context) => const ProfileScreen(),
          '/settings': (context) => const SettingsScreen(),
          '/history': (context) => const SosHistoryScreen(),
        },
      ),
    );
  }
}
