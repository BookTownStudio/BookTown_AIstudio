
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'icon';
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-opacity-80 focus:ring-primary',
    ghost: 'bg-transparent text-primary dark:text-accent hover:bg-primary/10 dark:hover:bg-accent/10 focus:ring-primary dark:focus:ring-accent',
    icon: 'p-2 rounded-full text-primary dark:text-accent hover:bg-primary/10 dark:hover:bg-accent/10 focus:ring-primary dark:focus:ring-accent',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;