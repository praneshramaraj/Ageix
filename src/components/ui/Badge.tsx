import React from 'react';

export interface BadgeProps {
  variant?: 'accent' | 'danger' | 'warning' | 'success' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'accent',
  size = 'sm',
  children,
  pulse = false,
}) => {
  const variantStyles = {
    accent: 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30',
    danger: 'bg-[#FF4B55]/15 text-[#FF4B55] border-[#FF4B55]/30',
    warning: 'bg-[#FFB000]/15 text-[#FFB000] border-[#FFB000]/30',
    success: 'bg-[#3DDC84]/15 text-[#3DDC84] border-[#3DDC84]/30',
    neutral: 'bg-[#1E3440] text-[#AAB6C3] border-[#2A4656]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold rounded-full border uppercase tracking-wider ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {pulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            variant === 'danger'
              ? 'bg-[#FF4B55]'
              : variant === 'warning'
              ? 'bg-[#FFB000]'
              : variant === 'success'
              ? 'bg-[#3DDC84]'
              : 'bg-[#00D4FF]'
          }`}
        />
      )}
      {children}
    </span>
  );
};
