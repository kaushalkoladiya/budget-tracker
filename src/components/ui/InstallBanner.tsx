'use client';

import { useState, useEffect, useRef } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Platform = 'ios' | 'android' | 'desktop' | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [platform, setPlatform] = useState<Platform>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

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
      } else if (userAgent.indexOf('Chrome') !== -1) {
        setPlatform('desktop');
        setShowBanner(true);
      }

      // Listen for the beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event so it can be triggered later
        deferredPrompt.current = e as BeforeInstallPromptEvent;
        // Update UI to notify the user they can install the PWA
        setShowBanner(true);
      });

      // When app is installed, hide the banner
      window.addEventListener('appinstalled', () => {
        setShowBanner(false);
        deferredPrompt.current = null;
      });
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

  const installApp = async () => {
    if (!deferredPrompt.current) {
      // The deferred prompt isn't available, so go to install page
      window.location.href = '/install';
      return;
    }

    // Show the install prompt
    deferredPrompt.current.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.current.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt for next time
    deferredPrompt.current = null;
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
        <div className="flex items-center flex-1">
          <FiDownload className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              {platform === 'ios' && "Install Budget Tracker on your iPhone"}
              {platform === 'android' && "Add Budget Tracker to your home screen"}
              {platform === 'desktop' && "Install Budget Tracker for desktop use"}
            </p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">
              {platform === 'ios' && "Tap the share button and select \"Add to Home Screen\""}
              {platform === 'android' && (deferredPrompt.current ? "Click Install" : "Tap the menu and select \"Install App\"")}
              {platform === 'desktop' && (deferredPrompt.current ? "Click Install" : "Click on the install icon in your browser&apos;s address bar")}
              {' '}
              <Link href="/install" className="underline">
                Learn more
              </Link>
            </p>
          </div>
        </div>
        
        <div className="flex items-center ml-4">
          {(platform === 'android' || platform === 'desktop') && (
            <button
              onClick={installApp}
              className="px-3 py-1.5 mr-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Install
            </button>
          )}
          <button 
            onClick={dismissBanner}
            className="text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
            aria-label="Dismiss banner"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 