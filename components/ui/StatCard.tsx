'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface StatCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
  accent?: 'green' | 'orange' | 'teal';
  className?: string;
}

export function StatCard({ 
  value, 
  label, 
  icon: Icon, 
  accent = 'green',
  className 
}: StatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const accentColors = {
    green: 'text-[var(--color-accent-green)]',
    orange: 'text-[var(--color-accent-orange)]',
    teal: 'text-[var(--color-accent-teal)]'
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'bg-[rgba(28,28,30,0.5)] border border-white/6 rounded-2xl p-8 md:p-10 hover:border-white/10 hover:-translate-y-1 transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <Icon className={cn('w-7 h-7', accentColors[accent])} />
      </div>
      <div className="text-4xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">
        {value}
      </div>
      <div className="text-sm text-[var(--color-fg-tertiary)] tracking-wide">
        {label}
      </div>
    </motion.div>
  );
}
