export type VehicleType = 'Ambulance' | 'Fire Truck' | 'Police Cruiser' | 'Rescue Boat' | 'Helicopter' | 'Drone Unit';
export type VehicleStatus = 'AVAILABLE' | 'ON MISSION' | 'MAINTENANCE' | 'REFUELING';

export interface Vehicle {
  id: string;
  code: string;
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  driverName: string;
  fuelPercent: number;
  assignedStation: string;
  currentSector: string;
  maintenanceDue: string;
}
