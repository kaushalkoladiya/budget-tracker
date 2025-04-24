'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiPieChart, 
  FiDollarSign, 
  FiCreditCard, 
  FiList,
  FiMenu,
  FiX,
  FiBell,
  FiBarChart
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { notificationStorage } from '@/lib/storage/localStorage';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Check for unread notifications
  useEffect(() => {
    const checkNotifications = () => {
      const notifications = notificationStorage.getAll();
      const unread = notifications.filter(n => !n.read).length;
      setUnreadNotifications(unread);
    };
    
    checkNotifications();
    
    // Set up an interval to check for new notifications
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Navigation items
  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Transactions', href: '/transactions', icon: <FiList className="w-5 h-5" /> },
    { name: 'Categories', href: '/categories', icon: <FiPieChart className="w-5 h-5" /> },
    { name: 'Insights', href: '/insights', icon: <FiBarChart className="w-5 h-5" /> },
    { name: 'Budgets', href: '/budgets', icon: <FiDollarSign className="w-5 h-5" /> },
    { name: 'Debts', href: '/debts', icon: <FiCreditCard className="w-5 h-5" /> },
    // { name: 'Settings', href: '/settings', icon: <FiSettings className="w-5 h-5" /> },
  ];
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden fixed md:flex flex-col h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center mb-8 px-2">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
            <FiDollarSign className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Budget Tracker</h1>
        </div>
        
        <div className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" 
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
                
                {/* Show notification badge for settings if there are unread notifications */}
                {item.name === 'Settings' && unreadNotifications > 0 && (
                  <span className="ml-auto flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
          <Link 
            href="/notifications"
            className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="mr-3 relative">
              <FiBell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </span>
            Notifications
            {unreadNotifications > 0 && (
              <span className="ml-auto flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                {unreadNotifications}
              </span>
            )}
          </Link>
        </div> */}
      </nav>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-30">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
              <FiDollarSign className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Budget Tracker</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/notifications" className="relative">
              <FiBell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-20 bg-gray-900/50 dark:bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              className="absolute top-16 right-0 bottom-0 w-64 bg-white dark:bg-gray-900 p-4"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" 
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      )}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                      
                      {/* Show notification badge for settings if there are unread notifications */}
                      {item.name === 'Settings' && unreadNotifications > 0 && (
                        <span className="ml-auto flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                          {unreadNotifications}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
