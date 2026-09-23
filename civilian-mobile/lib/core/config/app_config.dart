enum AppEnvironment { development, production }

class AppConfig {
  static AppEnvironment environment = AppEnvironment.production;

  // Production Backend URLs
  static const String productionApiBaseUrl =
      'https://aegisx-db.onrender.com/api/v1';
  static const String productionWebSocketUrl =
      'wss://aegisx-db.onrender.com/ws/sos';

  // Development Backend URLs
  static const String developmentApiBaseUrl = 'http://127.0.0.1:8000/api/v1';
  static const String developmentWebSocketUrl = 'ws://127.0.0.1:8000/ws/sos';

  static String get apiBaseUrl {
    switch (environment) {
      case AppEnvironment.production:
        return productionApiBaseUrl;
      case AppEnvironment.development:
        return developmentApiBaseUrl;
    }
  }

  static String get websocketUrl {
    switch (environment) {
      case AppEnvironment.production:
        return productionWebSocketUrl;
      case AppEnvironment.development:
        return developmentWebSocketUrl;
    }
  }

  // Legacy compatibility getter
  static String get baseUrl => apiBaseUrl;

  // HTTP Configuration
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);
  static const int maxRetries = 3;
}
