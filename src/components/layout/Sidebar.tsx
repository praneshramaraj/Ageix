import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { ROLE_PERMISSIONS, Permission } from '../../types/auth';
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Crosshair,
  Box,
  Truck,
  Users,
  Building2,
  Home,
  MessageSquare,
  Bot,
  BarChart3,
  FileText,
  Settings as SettingsIcon,
  ShieldCheck,
} from 'lucide-react';

export interface NavItemDef {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: 'accent' | 'danger' | 'warning' | 'success';
  requiredPermission?: Permission;
}

export const sidebarNavItems: NavItemDef[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, requiredPermission: 'VIEW_DASHBOARD' },
  { id: 'map', label: 'GIS Map', path: '/map', icon: Map, badge: 'OSM 3D', badgeVariant: 'accent' },
  { id: 'incidents', label: 'Incidents', path: '/incidents', icon: AlertTriangle, badge: '5 Active', badgeVariant: 'danger', requiredPermission: 'MANAGE_INCIDENTS' },
  { id: 'missions', label: 'Mission Center', path: '/missions', icon: Crosshair, badge: '3 Engaged', badgeVariant: 'warning', requiredPermission: 'MANAGE_MISSIONS' },
  { id: 'resources', label: 'Resources', path: '/resources', icon: Box, requiredPermission: 'MANAGE_RESOURCES' },
  { id: 'vehicles', label: 'Vehicles', path: '/vehicles', icon: Truck, requiredPermission: 'MANAGE_VEHICLES' },
  { id: 'personnel', label: 'Personnel', path: '/personnel', icon: Users, requiredPermission: 'MANAGE_PERSONNEL' },
  { id: 'hospitals', label: 'Hospitals', path: '/hospitals', icon: Building2, requiredPermission: 'MANAGE_HOSPITALS' },
  { id: 'shelters', label: 'Shelters', path: '/shelters', icon: Home, requiredPermission: 'MANAGE_SHELTERS' },
  { id: 'communication', label: 'Communication', path: '/communication', icon: MessageSquare, badge: 'LIVE', badgeVariant: 'accent', requiredPermission: 'BROADCAST_COMMUNICATION' },
  { id: 'ai-center', label: 'AI Center', path: '/ai-center', icon: Bot, badge: 'AI', badgeVariant: 'accent', requiredPermission: 'VIEW_AI_CENTER' },
  { id: 'analytics', label: 'Analytics', path: '/analytics', icon: BarChart3, requiredPermission: 'VIEW_ANALYTICS' },
  { id: 'reports', label: 'Reports', path: '/reports', icon: FileText, requiredPermission: 'EXPORT_REPORTS' },
  { id: 'settings', label: 'System Settings', path: '/settings', icon: SettingsIcon, requiredPermission: 'MANAGE_SETTINGS' },
  { id: 'admin', label: 'Admin Panel', path: '/admin', icon: ShieldCheck, badge: 'ADMIN', badgeVariant: 'danger', requiredPermission: 'ADMIN_ACCESS' },
];

export interface SidebarProps {
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const userPerms = user ? ROLE_PERMISSIONS[user.role] || [] : [];

  const isCurrentActive = (path: string) => location.pathname === path;

  const badgeVariants = {
    accent: 'bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30',
    danger: 'bg-[#FF4B55]/20 text-[#FF4B55] border-[#FF4B55]/30',
    warning: 'bg-[#FFB000]/20 text-[#FFB000] border-[#FFB000]/30',
    success: 'bg-[#3DDC84]/20 text-[#3DDC84] border-[#3DDC84]/30',
  };

  return (
    <aside
      className={`bg-[#10232C] border-r border-[#1E3440] h-[calc(100vh-4rem)] sticky top-16 z-20 flex flex-col justify-between transition-all duration-300 select-none shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Navigation Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {sidebarNavItems.map((item) => {
          const active = isCurrentActive(item.path);
          const Icon = item.icon;
          const hasAccess = !item.requiredPermission || userPerms.includes(item.requiredPermission);

          return (
            <button
              key={item.id}
              onClick={() => {
                if (hasAccess) {
                  navigate(item.path);
                } else {
                  navigate('/unauthorized');
                }
              }}
              title={isCollapsed ? item.label : undefined}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all group ${
                active
                  ? 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 shadow-sm'
                  : hasAccess
                  ? 'text-[#AAB6C3] hover:text-white hover:bg-[#1E3440] border border-transparent'
                  : 'text-[#6C7A89] opacity-50 cursor-not-allowed border border-transparent'
              }`}
            >
              {active && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#00D4FF] rounded-r" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  active ? 'text-[#00D4FF]' : hasAccess ? 'text-[#AAB6C3] group-hover:text-white' : 'text-[#6C7A89]'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] rounded-full border font-mono font-bold uppercase ${
                        badgeVariants[item.badgeVariant || 'accent']
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      {!isCollapsed && user && (
        <div className="p-3 border-t border-[#1E3440] bg-[#07161E]/80 m-2 rounded-xl text-left">
          <span className="text-[9px] font-mono font-bold text-[#00D4FF] uppercase tracking-wider block">
            EOC Node Authorized
          </span>
          <p className="text-xs font-bold text-white truncate mt-0.5">{user.fullName}</p>
          <p className="text-[10px] text-[#AAB6C3] truncate">{user.callsign} • {user.role}</p>
        </div>
      )}
    </aside>
  );
};
