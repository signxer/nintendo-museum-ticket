import React from 'react';
import { cn } from '../lib/utils';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function PixelButton({ 
  className, 
  variant = 'primary', 
  size = 'md',
  children,
  ...props 
}: PixelButtonProps) {
  const variants = {
    primary: "bg-nintendo-red text-white hover:bg-red-600 active:translate-y-1 active:shadow-none",
    secondary: "bg-nintendo-dark text-white hover:bg-gray-800 active:translate-y-1 active:shadow-none",
    outline: "bg-white text-nintendo-dark hover:bg-gray-50 active:translate-y-1 active:shadow-none"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-2 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button
      className={cn(
        "font-pixel border-4 border-nintendo-dark shadow-pixel transition-all duration-100",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
