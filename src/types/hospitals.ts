export interface Hospital {
  id: string;
  name: string;
  location: string;
  sector: string;
  totalBeds: number;
  occupiedBeds: number;
  icuBedsTotal: number;
  icuBedsOccupied: number;
  doctorsOnDuty: number;
  ambulancesStationed: number;
  status: 'NORMAL' | 'HIGH OCCUPANCY' | 'DIVERSION ALERT';
  phone: string;
}
