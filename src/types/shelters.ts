export interface Shelter {
  id: string;
  name: string;
  location: string;
  sector: string;
  capacity: number;
  currentOccupancy: number;
  foodSupplyDays: number;
  waterLitres: number;
  hasMedicalSupport: boolean;
  hasPowerGenerator: boolean;
  hasInternet: boolean;
  status: 'OPEN' | 'NEAR CAPACITY' | 'FULL';
  contactPerson: string;
}
