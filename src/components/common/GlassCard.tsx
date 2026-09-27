import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  solid?: boolean; // For dense tables/forms per prompt instruction
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  interactive = false,
  onClick,
  solid = false
}) => {
  const baseClasses = solid
    ? 'bg-white border border-slate-200/80 shadow-xs rounded-2xl'
    : 'glass-card rounded-2xl';

  const interactiveClasses = interactive
    ? 'glass-card-interactive cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} p-5 md:p-6 ${className}`}
    >
      {children}
    </div>
  );
};
