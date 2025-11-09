'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { buttonTap } from '@/lib/motionVariants';

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className,
  disabled,
  ariaLabel,
  type = 'button',
  onClick,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-3 font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background-base';
  
  const variantClasses = {
    primary: 'bg-accent-pink text-white hover:scale-105 shadow-glow-pink hover:shadow-glow-magenta',
    secondary: 'bg-transparent border-2 border-accent-pink/40 text-white hover:bg-accent-pink/10 hover:border-accent-pink',
    ghost: 'bg-transparent text-accent-pink hover:text-accent-magenta'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-12 py-5 text-lg'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <motion.button
      className={classes}
      disabled={disabled}
      type={type}
      onClick={onClick}
      whileTap={disabled ? undefined : buttonTap}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
    </motion.button>
  );
}
