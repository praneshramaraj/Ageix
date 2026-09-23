import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  variant?: 'accent' | 'danger' | 'warning' | 'success' | 'neutral';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  variant = 'accent',
  trend,
}) => {
  const iconColor: Record<'accent' | 'danger' | 'warning' | 'success' | 'neutral', string> = {
    accent: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/20',
    danger: 'text-[#FF4B55] bg-[#FF4B55]/10 border-[#FF4B55]/20',
    warning: 'text-[#FFB000] bg-[#FFB000]/10 border-[#FFB000]/20',
    success: 'text-[#3DDC84] bg-[#3DDC84]/10 border-[#3DDC84]/30',
    neutral: 'text-[#AAB6C3] bg-[#1E3440] border-[#2A4656]',
  };

  return (
    <div className="bg-[#10232C] border border-[#1E3440] rounded-[14px] p-4 flex items-center justify-between hover:border-[#00D4FF]/40 transition-all select-none">
      <div>
        <span className="text-[11px] font-bold text-[#AAB6C3] uppercase tracking-wider">{title}</span>
        <div className="text-2xl font-black font-mono text-white mt-1">{value}</div>
        {subtext && <p className="text-[11px] text-[#AAB6C3] mt-1">{subtext}</p>}
        {trend && <span className="text-[10px] font-mono text-[#3DDC84] font-bold mt-1 block">{trend}</span>}
      </div>
      <div className={`p-3 rounded-xl border ${iconColor[variant]}`}>{icon}</div>
    </div>
  );
};
