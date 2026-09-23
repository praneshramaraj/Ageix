import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen bg-[#07161E] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#10232C] border border-[#FF4B55]/30 rounded-[16px] p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 bg-[#FF4B55]/10 text-[#FF4B55] rounded-2xl flex items-center justify-center mx-auto border border-[#FF4B55]/30">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF4B55]/10 text-[#FF4B55] text-xs font-mono font-bold uppercase tracking-wider border border-[#FF4B55]/20">
            <Lock className="w-3.5 h-3.5" />
            Security Clearance Error 403
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Access Restricted</h1>
          <p className="text-xs text-[#AAB6C3] leading-relaxed">
            Your clearance role level (<span className="text-[#FFB000] font-bold">{user?.role || 'Guest'}</span>) does not hold authorization privileges to access this classified command module.
          </p>
        </div>

        <div className="pt-2">
          <Button onClick={() => navigate('/dashboard')} variant="accent" className="w-full">
            <ArrowLeft className="w-4 h-4" />
            Return to Operational Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
