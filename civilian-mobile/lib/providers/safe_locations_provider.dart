import 'package:flutter/material.dart';
import '../models/safe_location_model.dart';
import '../services/api_service.dart';

class SafeLocationsProvider with ChangeNotifier {
  List<SafeLocationModel> _shelters = [];
  List<SafeLocationModel> _hospitals = [];
  List<SafeLocationModel> _police = [];
  List<SafeLocationModel> _fireStations = [];
  bool _isLoading = false;

  List<SafeLocationModel> get shelters => _shelters;
  List<SafeLocationModel> get hospitals => _hospitals;
  List<SafeLocationModel> get police => _police;
  List<SafeLocationModel> get fireStations => _fireStations;
  bool get isLoading => _isLoading;

  SafeLocationsProvider() {
    fetchAll();
  }

  Future<void> fetchAll() async {
    _isLoading = true;
    notifyListeners();

    _shelters = await ApiService.getFacilities('shelters');
    _hospitals = await ApiService.getFacilities('hospitals');
    _police = await ApiService.getFacilities('police');
    _fireStations = await ApiService.getFacilities('fire');

    // Fallbacks if backend is starting up
    if (_shelters.isEmpty) {
      _shelters = [
        SafeLocationModel(
          id: 'sh_1',
          name: 'Central Sports Complex Evacuation Shelter',
          type: 'shelter',
          address: 'Kaveri Main Road, Sector 3',
          latitude: 12.9716,
          longitude: 77.5946,
          capacity: 800,
          occupied: 420,
          status: 'OPEN',
          contactPhone: '+91 80 2345 6789',
        ),
        SafeLocationModel(
          id: 'sh_2',
          name: 'St. Jude Community Relief Hub',
          type: 'shelter',
          address: '45 West Ridge Avenue',
          latitude: 12.9580,
          longitude: 77.5750,
          capacity: 400,
          occupied: 190,
          status: 'OPEN',
          contactPhone: '+91 80 2345 9988',
        ),
      ];
    }

    if (_hospitals.isEmpty) {
      _hospitals = [
        SafeLocationModel(
          id: 'hosp_1',
          name: 'Victoria Memorial General Emergency Hospital',
          type: 'hospital',
          address: 'Fort Road, Medical Zone',
          latitude: 12.9630,
          longitude: 77.5740,
          capacity: 350,
          occupied: 310,
          status: 'OPEN',
          contactPhone: '+91 80 2670 1111',
        ),
      ];
    }

    if (_police.isEmpty) {
      _police = [
        SafeLocationModel(
          id: 'pol_1',
          name: 'Central Disaster Police HQ Station',
          type: 'police',
          address: 'Infantry Road',
          latitude: 12.9800,
          longitude: 77.5980,
          status: 'OPEN',
          contactPhone: '100 / +91 80 2294 2222',
        ),
      ];
    }

    if (_fireStations.isEmpty) {
      _fireStations = [
        SafeLocationModel(
          id: 'fire_1',
          name: 'High-Volume Rescue Fire Station Delta',
          type: 'fire',
          address: 'Residency Road',
          latitude: 12.9700,
          longitude: 77.6050,
          status: 'OPEN',
          contactPhone: '101 / +91 80 2297 1500',
        ),
      ];
    }

    _isLoading = false;
    notifyListeners();
  }
}
