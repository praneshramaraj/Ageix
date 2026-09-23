import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action, breadcrumbs }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E3440] pb-4 mb-6 select-none">
      <div>
        {breadcrumbs && (
          <nav className="flex items-center gap-1.5 text-[10px] font-mono text-[#AAB6C3] uppercase tracking-wider mb-1">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-[#00D4FF] font-bold' : ''}>{bc.label}</span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">{title}</h1>
        {subtitle && <p className="text-xs text-[#AAB6C3] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};
