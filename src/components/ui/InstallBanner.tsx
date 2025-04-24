'use client';

import { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Platform = 'ios' | 'android' | 'desktop' | null;

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [platform, setPlatform] = useState<Platform>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (typeof window !== 'undefined') {
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
      
      // Check if banner was previously dismissed
      const dismissed = localStorage.getItem('installBannerDismissed');
      if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
        // Don't show if dismissed within the last week
        return;
      }
      
      // Detect platform
      const userAgent = navigator.userAgent;
      
      if (/iPad|iPhone|iPod/.test(userAgent) && !/CriOS/.test(userAgent) && !/FxiOS/.test(userAgent)) {
        setPlatform('ios');
        setShowBanner(true);
      } else if (/android/i.test(userAgent)) {
        setPlatform('android');
        setShowBanner(true);
      } else if (
        userAgent.indexOf('Chrome') !== -1 && 
        'BeforeInstallPromptEvent' in window
      ) {
        setPlatform('desktop');
        setShowBanner(true);
      }
    }
  }, []);

  useEffect(() => {
    // Add a class to the body when the banner is shown
    if (showBanner) {
      document.body.classList.add('has-install-banner');
    } else {
      document.body.classList.remove('has-install-banner');
    }
    
    return () => {
      document.body.classList.remove('has-install-banner');
    };
  }, [showBanner]);

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('installBannerDismissed', Date.now().toString());
  };

  // Don't show banner if already in standalone mode or no install method available
  if (isStandalone || !showBanner || !platform) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800 p-4 md:px-6"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <FiDownload className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              {platform === 'ios' && "Install Budget Tracker on your iPhone"}
              {platform === 'android' && "Add Budget Tracker to your home screen"}
              {platform === 'desktop' && "Install Budget Tracker for desktop use"}
            </p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
              {platform === 'ios' && "Tap the share button and select \"Add to Home Screen\""}
              {platform === 'android' && "Tap the menu and select \"Install App\""}
              {platform === 'desktop' && "Click on the install icon in your browser&apos;s address bar"}
              {' '}
              <Link href="/install" className="underline">
                Learn more
              </Link>
            </p>
          </div>
        </div>
        <button 
          onClick={dismissBanner}
          className="ml-4 text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
          aria-label="Dismiss banner"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
} 