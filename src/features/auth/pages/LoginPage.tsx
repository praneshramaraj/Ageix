import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Shield, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { loginSuccess, loginFailure } from '../authSlice';
import { UserProfile, UserRole } from '../../../types/auth';
import { API_BASE } from '../../../config/appConfig';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('commander@aegisx.gov');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Disaster Commander');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = API_BASE.replace(/\/api\/v1\/?$/, '');
      const loginUrl = `${baseUrl}/api/v1/auth/login`;

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          identifier: email.trim(),
          username: email.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      if (!response.ok) {
        let errorMsg = `Authentication failed (${response.status})`;
        try {
          const errData = await response.json();
          errorMsg = errData.detail || errData.message || errorMsg;
        } catch {
          // Response body was not JSON
        }
        dispatch(loginFailure());
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const user = data.user || {};

      const effectiveRole: UserRole = (user.roles && user.roles[0]) ? (user.roles[0] as UserRole) : selectedRole;
      let department = user.department || 'HQ Emergency Command Center';
      let callsign = user.callsign || 'ALPHA-1';

      if (effectiveRole === 'Administrator') {
        department = 'Global EOC Systems';
        callsign = 'OVERLORD-1';
      } else if (effectiveRole === 'Dispatcher') {
        department = 'Metro 911 Dispatch Hub';
        callsign = 'DISPATCH-9';
      } else if (effectiveRole === 'Rescue Team Leader') {
        department = 'Tactical Rescue Squad 4';
        callsign = 'RESCUE-4';
      } else if (effectiveRole === 'Field Officer') {
        department = 'Coastal Field Unit';
        callsign = 'FIELD-12';
      } else if (effectiveRole === 'Viewer') {
        department = 'Public Media Desk';
        callsign = 'VIEWER-0';
      }

      const userProfile: UserProfile = {
        id: user.id || 'usr_' + Date.now(),
        email: user.email || email,
        username: user.username || (email.includes('@') ? email.split('@')[0] : email),
        fullName: user.fullName || (user.username ? user.username.toUpperCase() : 'Commander Alex Vance'),
        role: effectiveRole,
        department,
        callsign,
        badgeNumber: user.badgeNumber || ('AGX-' + Math.floor(1000 + Math.random() * 9000)),
      };

      dispatch(
        loginSuccess({
          token: data.access_token || data.token || '',
          refreshToken: data.refresh_token || '',
          user: userProfile,
        })
      );

      setLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      dispatch(loginFailure());
      setError(err?.message || 'Network error: Failed to connect to authentication server');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07161E] flex items-center justify-center p-4 select-none relative overflow-hidden font-sans">
      {/* Subtle EOC Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E3440_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="max-w-md w-full bg-[#10232C] border border-[#1E3440] rounded-[16px] p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#00D4FF]/10 rounded-2xl flex items-center justify-center mx-auto border border-[#00D4FF]/20 shadow-lg shadow-[#00D4FF]/10 overflow-hidden p-1.5">
            <img src="/aegisx_logo.png" alt="AegisX Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white font-mono uppercase mt-3">
            AEGIS<span className="text-[#00D4FF]">X</span> EOC
          </h1>
          <p className="text-xs text-[#AAB6C3]">Emergency Operations Center Command Portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#FF4B55]/10 border border-[#FF4B55]/30 text-[#FF4B55] p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono font-bold text-[#AAB6C3] uppercase tracking-wider block mb-1">
              Select Clearance Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full bg-[#07161E] border border-[#1E3440] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D4FF] font-semibold"
            >
              <option value="Administrator">Administrator (Full Systems)</option>
              <option value="Disaster Commander">Disaster Commander (Strategic HQ)</option>
              <option value="Dispatcher">Dispatcher (Incident & Unit Allocation)</option>
              <option value="Rescue Team Leader">Rescue Team Leader (Tactical Execution)</option>
              <option value="Field Officer">Field Officer (Field Telemetry)</option>
              <option value="Viewer">Viewer (Read-Only Awareness)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold text-[#AAB6C3] uppercase tracking-wider block mb-1">
              User Identifier / Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-[#00D4FF]" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#07161E] border border-[#1E3440] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#6C7A89] focus:outline-none focus:border-[#00D4FF]"
                placeholder="operator@aegisx.gov or username"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold text-[#AAB6C3] uppercase tracking-wider block mb-1">
              Security Token / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-[#00D4FF]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#07161E] border border-[#1E3440] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#6C7A89] focus:outline-none focus:border-[#00D4FF]"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#AAB6C3]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#1E3440] bg-[#07161E] text-[#00D4FF] focus:ring-0 w-3.5 h-3.5"
              />
              <span>Remember Session</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact system administrator to reset JWT security credentials.'); }} className="text-[#00D4FF] hover:underline">
              Forgot Token?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00D4FF] hover:bg-[#66E5FF] text-[#07161E] font-extrabold text-xs tracking-wider uppercase rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00D4FF]/20 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Establish Command Connection</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-[#1E3440] pt-4 text-center">
          <p className="text-[11px] text-[#AAB6C3] font-mono">
            AEGISX v2.4 EOC System • Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};
