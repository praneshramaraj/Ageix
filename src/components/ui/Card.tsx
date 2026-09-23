import React from 'react';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  glow?: 'accent' | 'danger' | 'warning' | 'success' | 'none';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  glow = 'none',
  children,
  className = '',
}) => {
  const glowStyles = {
    none: '',
    accent: 'glow-accent',
    danger: 'glow-danger',
    warning: 'glow-warning',
    success: 'glow-success',
  };

  return (
    <div
      className={`bg-[#10232C] border border-[#1E3440] rounded-[14px] p-4 text-white transition-all ${glowStyles[glow]} ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-[#1E3440] pb-3 mb-3">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-[11px] text-[#AAB6C3] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
