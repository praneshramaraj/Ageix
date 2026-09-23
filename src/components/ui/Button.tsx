import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'accent' | 'danger' | 'warning' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'accent',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    accent: 'bg-[#00D4FF] hover:bg-[#66E5FF] text-[#07161E] font-bold shadow-md shadow-[#00D4FF]/20',
    danger: 'bg-[#FF4B55] hover:bg-[#D92D37] text-white font-bold shadow-md shadow-[#FF4B55]/20',
    warning: 'bg-[#FFB000] hover:bg-[#CC8D00] text-[#07161E] font-bold shadow-md shadow-[#FFB000]/20',
    success: 'bg-[#3DDC84] hover:bg-[#2CB366] text-[#07161E] font-bold shadow-md shadow-[#3DDC84]/20',
    outline: 'border border-[#1E3440] hover:border-[#00D4FF] text-[#AAB6C3] hover:text-white bg-transparent',
    ghost: 'text-[#AAB6C3] hover:text-white hover:bg-[#10232C]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-xs px-3.5 py-2',
    lg: 'text-sm px-4 py-2.5',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
