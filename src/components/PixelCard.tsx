import React from 'react';
import { cn } from '../lib/utils';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function PixelCard({ className, title, children, ...props }: PixelCardProps) {
  return (
    <div 
      className={cn(
        "bg-white border-4 border-nintendo-dark shadow-pixel p-6 relative",
        className
      )} 
      {...props}
    >
      {title && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-nintendo-red text-white px-4 py-1 border-4 border-nintendo-dark font-pixel text-sm whitespace-nowrap">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
