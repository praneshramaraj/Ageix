import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { logout, switchRole } from '../../features/auth/authSlice';
import { UserRole } from '../../types/auth';
import { Badge } from '../ui/Badge';
import {
  Shield,
  Bell,
  Clock,
  Radio,
  UserCheck,
  LogOut,
  ChevronDown,
  Activity,
  Menu,
} from 'lucide-react';

export interface TopNavbarProps {
  onToggleSidebar?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [utcTime, setUtcTime] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const rolesList: UserRole[] = [
    'Administrator',
    'Disaster Commander',
    'Dispatcher',
    'Rescue Team Leader',
    'Field Officer',
    'Viewer',
  ];

  return (
    <header className="h-16 bg-[#10232C] border-b border-[#1E3440] flex items-center justify-between px-4 sm:px-6 z-30 select-none font-sans text-white sticky top-0 shrink-0">
      {/* Left: Brand & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-[#AAB6C3] hover:text-white hover:bg-[#1E3440] transition-colors"
            title="Toggle EOC Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-10 h-10 bg-[#00D4FF]/10 text-[#00D4FF] rounded-xl flex items-center justify-center border border-[#00D4FF]/30 shadow-md shadow-[#00D4FF]/10 group-hover:scale-105 transition-transform overflow-hidden p-1">
            <img src="/aegisx_logo.png" alt="AegisX Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider uppercase font-mono flex items-center gap-1.5 leading-none">
              AEGIS<span className="text-[#00D4FF]">X</span>
              <span className="text-[9px] text-[#00D4FF] bg-[#00D4FF]/15 px-1.5 py-0.5 rounded border border-[#00D4FF]/30 font-bold">
                EOC v2.4
              </span>
            </h1>
            <p className="text-[10px] text-[#AAB6C3] font-mono tracking-tight hidden sm:block">
              Rescue Command Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Active Mission Ticker & Clock */}
      <div className="hidden lg:flex items-center gap-4 bg-[#07161E] border border-[#1E3440] px-4 py-1.5 rounded-full">
        <div className="flex items-center gap-2 text-xs">
          <Radio className="w-3.5 h-3.5 text-[#FF4B55] animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-[#FF4B55] uppercase">Active Mission:</span>
          <span className="text-xs font-semibold text-white truncate max-w-[200px]">
            Operation Tidal Shield Evac
          </span>
          <Badge variant="accent" size="sm">
            ENGAGED
          </Badge>
        </div>

        <div className="h-3 w-px bg-[#1E3440]" />

        <div className="flex items-center gap-1.5 text-xs font-mono text-[#00D4FF]">
          <Clock className="w-3.5 h-3.5" />
          <span>{utcTime || '00:00:00 UTC'}</span>
        </div>
      </div>

      {/* Right: Role Switcher, Clearance Badge, Profile */}
      <div className="flex items-center gap-3">
        {/* Interactive Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 bg-[#07161E] border border-[#1E3440] hover:border-[#00D4FF]/50 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="font-bold text-white hidden md:inline">{user?.role || 'Switch Role'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#AAB6C3]" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#10232C] border border-[#1E3440] rounded-xl shadow-2xl py-1 z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-[#1E3440] text-[10px] font-mono uppercase text-[#AAB6C3] font-bold">
                Switch Security Clearance
              </div>
              {rolesList.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    dispatch(switchRole(r));
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#1E3440] transition-colors ${
                    user?.role === r ? 'text-[#00D4FF] font-bold bg-[#00D4FF]/10' : 'text-[#AAB6C3]'
                  }`}
                >
                  <span>{r}</span>
                  {user?.role === r && <Activity className="w-3.5 h-3.5 text-[#00D4FF]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          onClick={() => navigate('/communication')}
          className="p-2 rounded-lg text-[#AAB6C3] hover:text-white hover:bg-[#1E3440] transition-colors relative"
          title="Emergency Dispatch Broadcasts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4B55] ring-2 ring-[#10232C] animate-pulse" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#1E3440] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] font-bold font-mono text-xs flex items-center justify-center">
              {user?.fullName?.charAt(0) || 'O'}
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#10232C] border border-[#1E3440] rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-[#1E3440]">
                <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
                <p className="text-[10px] font-mono text-[#00D4FF] mt-0.5">{user?.role}</p>
                <p className="text-[10px] text-[#AAB6C3] mt-0.5">{user?.department}</p>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#AAB6C3] hover:text-white hover:bg-[#1E3440] transition-colors"
              >
                Profile & Settings
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  dispatch(logout());
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#FF4B55] hover:bg-[#FF4B55]/15 transition-colors font-bold flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out Command
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
