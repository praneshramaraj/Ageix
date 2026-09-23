import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Shield, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { loginSuccess } from '../authSlice';
import { UserRole } from '../../../types/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('commander@aegisx.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Disaster Commander');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      let fullName = 'Commander Alex Vance';
      let department = 'HQ Emergency Command Center';
      let callsign = 'ALPHA-1';

      if (selectedRole === 'Administrator') {
        fullName = 'Director Elena Rostova';
        department = 'Global EOC Systems';
        callsign = 'OVERLORD-1';
      } else if (selectedRole === 'Dispatcher') {
        fullName = 'Officer Marcus Brody';
        department = 'Metro 911 Dispatch Hub';
        callsign = 'DISPATCH-9';
      } else if (selectedRole === 'Rescue Team Leader') {
        fullName = 'Captain Sarah Jenkins';
        department = 'Tactical Rescue Squad 4';
        callsign = 'RESCUE-4';
      } else if (selectedRole === 'Field Officer') {
        fullName = 'Officer David Miller';
        department = 'Coastal Field Unit';
        callsign = 'FIELD-12';
      } else if (selectedRole === 'Viewer') {
        fullName = 'Observer Taylor Swift';
        department = 'Public Media Desk';
        callsign = 'VIEWER-0';
      }

      dispatch(
        loginSuccess({
          token: 'jwt_access_token_' + Date.now(),
          refreshToken: 'jwt_refresh_token_' + Date.now(),
          user: {
            id: 'usr_' + Math.random().toString(36).substring(2, 9),
            email,
            username: email.split('@')[0],
            fullName,
            role: selectedRole,
            department,
            callsign,
            badgeNumber: 'AGX-' + Math.floor(1000 + Math.random() * 9000),
          },
        })
      );

      setLoading(false);
      navigate('/dashboard');
    }, 600);
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#07161E] border border-[#1E3440] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#6C7A89] focus:outline-none focus:border-[#00D4FF]"
                placeholder="operator@aegisx.gov"
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
