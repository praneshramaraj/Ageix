import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/safe_locations_provider.dart';
import '../../models/safe_location_model.dart';

class SafeLocationsScreen extends StatelessWidget {
  const SafeLocationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final prov = Provider.of<SafeLocationsProvider>(context);

    return DefaultTabController(
      length: 4,
      child: Scaffold(
        backgroundColor: const Color(0xFF07161E),
        appBar: AppBar(
          backgroundColor: const Color(0xFF10232C),
          title: const Text('Safe Emergency Facilities', style: TextStyle(color: Colors.white)),
          bottom: const TabBar(
            isScrollable: true,
            indicatorColor: Color(0xFF00D4FF),
            labelColor: Color(0xFF00D4FF),
            unselectedLabelColor: Color(0xFFAAB6C3),
            tabs: [
              Tab(icon: Icon(Icons.night_shelter), text: 'Shelters'),
              Tab(icon: Icon(Icons.local_hospital), text: 'Hospitals'),
              Tab(icon: Icon(Icons.local_police), text: 'Police'),
              Tab(icon: Icon(Icons.fire_truck), text: 'Fire Stations'),
            ],
          ),
        ),
        body: prov.isLoading
            ? const Center(child: CircularProgressIndicator(color: Color(0xFF00D4FF)))
            : TabBarView(
                children: [
                  _buildList(prov.shelters, Icons.night_shelter, const Color(0xFF00D4FF)),
                  _buildList(prov.hospitals, Icons.local_hospital, const Color(0xFFFF4D4D)),
                  _buildList(prov.police, Icons.local_police, const Color(0xFF3182CE)),
                  _buildList(prov.fireStations, Icons.fire_truck, const Color(0xFFFFB000)),
                ],
              ),
      ),
    );
  }

  Widget _buildList(List<SafeLocationModel> items, IconData icon, Color color) {
    if (items.isEmpty) {
      return const Center(
        child: Text('No facilities registered in this category.', style: TextStyle(color: Color(0xFFAAB6C3))),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          color: const Color(0xFF10232C),
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
            side: const BorderSide(color: Color(0xFF1E3440)),
          ),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: color.withOpacity(0.2),
              child: Icon(icon, color: color),
            ),
            title: Text(item.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(item.address, style: const TextStyle(color: Color(0xFFAAB6C3), fontSize: 12)),
                const SizedBox(height: 4),
                if (item.capacity != null)
                  Text('Occupancy: ${item.occupied} / ${item.capacity}', style: TextStyle(color: color, fontSize: 11)),
                Text('Phone: ${item.contactPhone}', style: const TextStyle(color: Colors.white70, fontSize: 11)),
              ],
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF3DDC84).withOpacity(0.2),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(item.status, style: const TextStyle(color: Color(0xFF3DDC84), fontWeight: FontWeight.bold, fontSize: 10)),
            ),
          ),
        );
      },
    );
  }
}
