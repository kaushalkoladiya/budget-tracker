import React, { useState } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  selectedDate: Date | string;
  onChange: (date: string) => void;
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function DatePicker({
  selectedDate,
  onChange,
  id,
  name,
  label,
  required = false,
  className = '',
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  // Convert string date to Date object if needed
  const selected = selectedDate ? new Date(selectedDate) : null;
  
  // Format date as YYYY-MM-DD for input value
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Format date for display
  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  
  // Handle month navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Handle date selection
  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(formatDateForInput(newDate));
    setShowCalendar(false);
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    
    // Update calendar view if date is valid
    if (e.target.value) {
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      }
    }
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selected && 
        date.getDate() === selected.getDate() && 
        date.getMonth() === selected.getMonth() && 
        date.getFullYear() === selected.getFullYear();
      
      const isToday = new Date().toDateString() === date.toDateString();
      
      days.push(
        <button
          key={day}
          type="button"
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm focus:outline-none
            ${isSelected 
              ? 'bg-blue-500 text-white' 
              : isToday
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiCalendar className="text-gray-400" />
        </div>
        
        <input
          type="text"
          id={id}
          name={name}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
          placeholder="Select date"
          value={formatDateForDisplay(selected)}
          onClick={() => setShowCalendar(true)}
          readOnly
          required={required}
        />
        
        <input
          type="date"
          className="sr-only"
          value={formatDateForInput(selected)}
          onChange={handleInputChange}
          required={required}
        />
      </div>
      
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            className="absolute z-50 mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-72"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onBlur={() => setShowCalendar(false)}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={prevMonth}
              >
                <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="font-medium text-gray-900 dark:text-white">
                {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </div>
              
              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={nextMonth}
              >
                <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div
                  key={day}
                  className="h-8 w-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays()}
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => {
                  const today = new Date();
                  onChange(formatDateForInput(today));
                  setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  setShowCalendar(false);
                }}
              >
                Today
              </button>
              
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={() => setShowCalendar(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
