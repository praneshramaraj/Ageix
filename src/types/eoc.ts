// Phase 4 EOC TypeScript Type Definitions

export type EocDefconLevel = 'DEFCON 1' | 'DEFCON 2' | 'DEFCON 3' | 'DEFCON 4' | 'DEFCON 5';

export type MissionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';

export type MissionStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled' | 'Emergency';

export interface MissionTimelineEvent {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  details?: string;
}

export interface MissionAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
  timestamp: string;
}

export interface MissionItem {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: MissionPriority;
  status: MissionStatus;
  targetLocation: [number, number];
  locationName: string;
  assignedTeamIds: string[];
  assignedVehicleIds: string[];
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  timeline: MissionTimelineEvent[];
  notes?: string[];
  attachments?: MissionAttachment[];
}

export type TeamType = 'rescue' | 'police' | 'fire' | 'medical' | 'volunteers' | 'drone_operators';

export type TeamAvailability = 'Ready' | 'Deployed' | 'Resting' | 'Offline';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  callsign: string;
}

export interface TeamItem {
  id: string;
  name: string;
  type: TeamType;
  leaderName: string;
  contactNumber: string;
  availability: TeamAvailability;
  currentMissionId?: string;
  locationName: string;
  coordinates: [number, number];
  members: TeamMember[];
  skillSet: string[];
  equipment: string[];
  avgResponseTimeMin: number;
}

export type VehicleCategory = 'ambulance' | 'fire_truck' | 'rescue_boat' | 'helicopter' | 'uav_drone' | 'command_vehicle';

export type VehicleStatus = 'Operational' | 'Dispatched' | 'Maintenance' | 'Out of Service';

export interface VehicleItem {
  id: string;
  callsign: string;
  category: VehicleCategory;
  model: string;
  licensePlate: string;
  fuelPercent: number; // 0 - 100
  capacity: number;
  driverName: string;
  driverPhone: string;
  assignedMissionId?: string;
  status: VehicleStatus;
  coordinates: [number, number];
  lastPingTime: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'medical' | 'food' | 'water' | 'blankets' | 'fuel' | 'tools' | 'generators' | 'shelters';
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  unit: string;
  storageHub: string;
  status: 'OPTIMAL' | 'LOW STOCK' | 'CRITICAL EMPTY';
  lastRestocked: string;
}

export interface ResourceDistributionLog {
  id: string;
  resourceId: string;
  resourceName: string;
  quantity: number;
  unit: string;
  destination: string;
  missionId?: string;
  dispatchedBy: string;
  timestamp: string;
}

export type IncidentCategory = 'sos' | 'flood' | 'fire' | 'landslide' | 'earthquake' | 'cyclone' | 'road_closure' | 'missing_person';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 'Open' | 'Triaged' | 'In Progress' | 'Resolved' | 'Closed';

export interface IncidentItem {
  id: string;
  code: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  coordinates: [number, number];
  locationName: string;
  reportedBy: string;
  contactNumber: string;
  affectedCount: number;
  assignedMissionId?: string;
  timestamp: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  channel: 'general' | 'mission' | 'command' | 'emergency';
  text: string;
  timestamp: string;
  isUrgent?: boolean;
}

export interface EmergencyBroadcast {
  id: string;
  sender: string;
  title: string;
  message: string;
  severity: 'warning' | 'critical' | 'evacuation';
  targetAudience: string;
  timestamp: string;
  isAcknowledged: boolean;
}

export type UserRole = 'Super Admin' | 'Admin' | 'Dispatcher' | 'Rescue Commander' | 'Team Leader' | 'Field Rescuer' | 'Observer';

export interface EocUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'Active' | 'Inactive' | 'On Duty';
  phone: string;
  lastActive: string;
  avatarUrl?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetModule: string;
  details: string;
  ipAddress: string;
}
