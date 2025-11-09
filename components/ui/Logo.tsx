'use client';

import { Database } from 'lucide-react';

export interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Gradient Box with Database Icon */}
      <div className="relative group">
        <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-accent-pink via-accent-magenta to-accent-mesh flex items-center justify-center shadow-glow-pink transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-magenta`}>
          <Database className="w-[60%] h-[60%] text-white" strokeWidth={2.5} />
        </div>
        {/* Animated glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-xl bg-gradient-to-br from-accent-pink to-accent-magenta opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`}></div>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`${textSizeClasses[size]} font-display font-bold text-white tracking-tight`}>
          DatasetDAO
        </span>
      )}
    </div>
  );
}
