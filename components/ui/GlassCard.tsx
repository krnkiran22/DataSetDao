'use client';

import { ReactNode, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { hoverLift } from '@/lib/motionVariants';

export interface GlassCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className, 
  hover = true,
  onClick,
  ...props 
}: GlassCardProps) {
  const baseClasses = 'bg-[rgba(28,28,30,0.6)] backdrop-blur-2xl border border-white/8 rounded-2xl p-10 transition-all duration-300';
  const hoverClasses = hover ? 'hover:border-white/12 hover:-translate-y-1' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const classes = cn(baseClasses, hoverClasses, clickableClasses, className);

  const Component = onClick ? motion.div : 'div';

  if (onClick) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        whileHover={hoverLift}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
