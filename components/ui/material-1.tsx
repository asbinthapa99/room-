import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface MaterialProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'menu' | 'card' | 'dialog';
  elevation?: 'sm' | 'md' | 'lg';
}

const Material = forwardRef<HTMLDivElement, MaterialProps>(
  ({ className, type = 'card', elevation = 'md', ...props }, ref) => {
    const elevationClasses = {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200 bg-white',
          elevationClasses[elevation],
          type === 'menu' && 'rounded-lg shadow-lg',
          type === 'dialog' && 'rounded-xl shadow-2xl',
          className
        )}
        {...props}
      />
    );
  }
);

Material.displayName = 'Material';

export { Material };
