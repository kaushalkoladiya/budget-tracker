import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<"div">, "isHoverable" | "isClickable"> {
  variant?: 'default' | 'outline' | 'filled';
  isHoverable?: boolean;
  isClickable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    isHoverable = false, 
    isClickable = false,
    children, 
    whileHover,
    ...props 
  }, ref) => {
    // Base styles
    const baseStyles = 'rounded-xl overflow-hidden';
    
    // Variant styles
    const variantStyles = {
      default: 'bg-white dark:bg-gray-800 shadow-sm',
      outline: 'border border-gray-200 dark:border-gray-700',
      filled: 'bg-gray-50 dark:bg-gray-900',
    };
    
    // Interactive styles
    const hoverStyles = isHoverable ? 'transition-all duration-200 hover:shadow-md' : '';
    const clickableStyles = isClickable ? 'cursor-pointer active:scale-[0.98]' : '';
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          hoverStyles,
          clickableStyles,
          className
        )}
        whileHover={isHoverable ? { y: -4 } : whileHover}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-b border-gray-100 dark:border-gray-700', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Title Component
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

// Card Content Component
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// Card Footer Component
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-t border-gray-100 dark:border-gray-700', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
