import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children?: React.ReactNode;
  showIcon?: boolean;
}

export default function Tooltip({ 
  content, 
  position = 'top', 
  children,
  showIcon = true 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2'
  };
  
  return (
    <div className="relative inline-flex items-center">
      <div 
        className="inline-flex"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children || (showIcon && (
          <FiInfo className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-help" />
        ))}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className={`absolute z-50 ${positionClasses[position]} px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-800 rounded-md shadow-md whitespace-nowrap max-w-xs`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            {content}
            <div 
              className={`absolute ${
                position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent' :
                position === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent' :
                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent' :
                'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent'
              } border-4`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
