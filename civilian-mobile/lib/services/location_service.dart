import 'package:geolocator/geolocator.dart';

class LocationResult {
  final double latitude;
  final double longitude;
  final bool isFallback;
  final String? error;

  LocationResult({
    required this.latitude,
    required this.longitude,
    this.isFallback = false,
    this.error,
  });
}

class LocationService {
  // Default fallback coordinates (e.g. Bangalore emergency center baseline)
  static const double fallbackLatitude = 12.9620;
  static const double fallbackLongitude = 77.5880;

  static Future<LocationResult> getCurrentLocation({
    Duration timeout = const Duration(seconds: 5),
    int maxRetries = 2,
  }) async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        return LocationResult(
          latitude: fallbackLatitude,
          longitude: fallbackLongitude,
          isFallback: true,
          error: 'GPS location services are disabled.',
        );
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          return LocationResult(
            latitude: fallbackLatitude,
            longitude: fallbackLongitude,
            isFallback: true,
            error: 'Location permissions denied.',
          );
        }
      }

      if (permission == LocationPermission.deniedForever) {
        return LocationResult(
          latitude: fallbackLatitude,
          longitude: fallbackLongitude,
          isFallback: true,
          error: 'Location permissions permanently denied.',
        );
      }

      int attempts = 0;
      while (attempts <= maxRetries) {
        try {
          Position position = await Geolocator.getCurrentPosition(
            locationSettings: const LocationSettings(
              accuracy: LocationAccuracy.high,
              timeLimit: Duration(seconds: 4),
            ),
          );
          return LocationResult(
            latitude: position.latitude,
            longitude: position.longitude,
            isFallback: false,
          );
        } catch (e) {
          attempts++;
          if (attempts > maxRetries) {
            Position? lastKnown = await Geolocator.getLastKnownPosition();
            if (lastKnown != null) {
              return LocationResult(
                latitude: lastKnown.latitude,
                longitude: lastKnown.longitude,
                isFallback: true,
                error: 'Used last known position due to timeout.',
              );
            }
            break;
          }
          await Future.delayed(const Duration(milliseconds: 500));
        }
      }

      return LocationResult(
        latitude: fallbackLatitude,
        longitude: fallbackLongitude,
        isFallback: true,
        error: 'Location timeout. Used default coordinates.',
      );
    } catch (e) {
      return LocationResult(
        latitude: fallbackLatitude,
        longitude: fallbackLongitude,
        isFallback: true,
        error: e.toString(),
      );
    }
  }
}
