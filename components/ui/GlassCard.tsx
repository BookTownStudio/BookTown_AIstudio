
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-white/60 dark:bg-white/5 backdrop-blur-lg 
        border border-black/5 dark:border-white/10 
        rounded-card 
        shadow-lg shadow-black/10 dark:shadow-black/20 
        p-6 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;