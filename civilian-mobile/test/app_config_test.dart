import 'package:flutter_test/flutter_test.dart';
import 'package:civilian_mobile/core/config/app_config.dart';

void main() {
  group('AppConfig Tests', () {
    test('Default environment is Production', () {
      expect(AppConfig.environment, equals(AppEnvironment.production));
    });

    test('Production API Base URL matches Render production endpoint', () {
      AppConfig.environment = AppEnvironment.production;
      expect(
        AppConfig.apiBaseUrl,
        equals('https://aegisx-db.onrender.com/api/v1'),
      );
      expect(
        AppConfig.baseUrl,
        equals('https://aegisx-db.onrender.com/api/v1'),
      );
    });

    test('Production WebSocket URL matches Render wss endpoint', () {
      AppConfig.environment = AppEnvironment.production;
      expect(
        AppConfig.websocketUrl,
        equals('wss://aegisx-db.onrender.com/ws/sos'),
      );
    });

    test('Development URLs switch cleanly', () {
      AppConfig.environment = AppEnvironment.development;
      expect(AppConfig.apiBaseUrl, equals('http://127.0.0.1:8000/api/v1'));
      expect(AppConfig.websocketUrl, equals('ws://127.0.0.1:8000/ws/sos'));

      // Restore Production
      AppConfig.environment = AppEnvironment.production;
    });
  });
}
