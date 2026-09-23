export type ResourceCategory = 'Food & Rations' | 'Water' | 'Medicine' | 'Fuel' | 'Generators' | 'Medical Kits' | 'Equipment';

export interface ResourceItem {
  id: string;
  code: string;
  name: string;
  category: ResourceCategory;
  currentStock: number;
  minThreshold: number;
  unit: string;
  storageHub: string;
  status: 'OPTIMAL' | 'LOW STOCK' | 'CRITICAL EMPTY';
  lastReplenished: string;
}
