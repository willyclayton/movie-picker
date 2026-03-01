import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'overlay';
};

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        variant === 'default' && 'bg-card',
        variant === 'overlay' && 'bg-overlay',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
