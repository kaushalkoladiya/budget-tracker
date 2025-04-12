import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animate?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    className, 
    value = 0, 
    variant = 'default', 
    size = 'md',
    showValue = false,
    animate = true,
    ...props 
  }, ref) => {
    // Ensure value is between 0-100
    const clampedValue = Math.max(0, Math.min(100, value));
    
    // Base styles
    const baseStyles = 'w-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700';
    
    // Size styles
    const sizeStyles = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-4',
    };
    
    // Variant styles for the progress indicator
    const variantStyles = {
      default: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
    };
    
    // Determine color based on value for automatic coloring
    const getAutomaticVariant = () => {
      if (clampedValue < 50) return variantStyles.success;
      if (clampedValue < 80) return variantStyles.warning;
      return variantStyles.danger;
    };
    
    // Text size based on progress bar size
    const textSizeStyles = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };
    
    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(
            baseStyles,
            sizeStyles[size],
            className
          )}
          {...props}
        >
          <motion.div
            className={cn(
              variant === 'default' ? getAutomaticVariant() : variantStyles[variant],
              'h-full'
            )}
            initial={animate ? { width: '0%' } : { width: `${clampedValue}%` }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        
        {showValue && (
          <div className="flex justify-end mt-1">
            <span className={cn(
              textSizeStyles[size],
              'text-gray-500 dark:text-gray-400'
            )}>
              {clampedValue}%
            </span>
          </div>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
