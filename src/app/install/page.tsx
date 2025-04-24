'use client';

import { FiArrowLeft, FiDownload, FiSmartphone, FiMonitor } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPage() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [installSupported, setInstallSupported] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      
      if (/iPad|iPhone|iPod/.test(userAgent) && !/CriOS/.test(userAgent) && !/FxiOS/.test(userAgent)) {
        setPlatform('ios');
      } else if (/android/i.test(userAgent)) {
        setPlatform('android');
      } else {
        setPlatform('desktop');
      }

      // Listen for the beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event so it can be triggered later
        deferredPrompt.current = e as BeforeInstallPromptEvent;
        setInstallSupported(true);
      });
    }
  }, []);

  const installApp = async () => {
    if (!deferredPrompt.current) {
      return;
    }

    // Show the install prompt
    deferredPrompt.current.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.current.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setInstallSupported(false);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt for next time
    deferredPrompt.current = null;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 md:pt-0 md:pl-64">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Install Budget Tracker App
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FiDownload className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Install as an App on Your Device
              </h2>
            </div>
            {installSupported && (
              <button
                onClick={installApp}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Install Now
              </button>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Budget Tracker is a progressive web app (PWA), which means you can install it directly on your device without going through an app store.
          </p>
        </div>
        
        {platform === 'ios' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
            <div className="flex items-center mb-4">
              <FiSmartphone className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                iOS Installation Instructions
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>Follow these steps to install Budget Tracker on your iPhone or iPad:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Open Budget Tracker in <strong>Safari</strong> (this doesn&apos;t work in Chrome or other browsers on iOS)</li>
                <li>Tap the <strong>Share</strong> icon in the browser toolbar</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                <li>Name the app, then tap <strong>Add</strong> in the top-right corner</li>
                <li>You&apos;ll now see the Budget Tracker app icon on your home screen</li>
              </ol>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">
                Note: The app will run in full-screen mode without Safari&apos;s browser interface.
              </p>
            </div>
          </div>
        )}
        
        {platform === 'android' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiSmartphone className="w-6 h-6 text-green-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Android Installation Instructions
                </h2>
              </div>
              {installSupported && (
                <button
                  onClick={installApp}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Install
                </button>
              )}
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>Follow these steps to install Budget Tracker on your Android device:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Open Budget Tracker in <strong>Chrome</strong> or another compatible browser</li>
                <li>Tap the <strong>three-dot menu</strong> in the top-right corner</li>
                <li>Tap <strong>Install App</strong> or <strong>Add to Home Screen</strong></li>
                <li>Confirm by tapping <strong>Install</strong></li>
                <li>You&apos;ll now see the Budget Tracker app icon on your home screen</li>
              </ol>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">
                Note: The app will run in full-screen mode without the browser interface.
              </p>
            </div>
          </div>
        )}
        
        {platform === 'desktop' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiMonitor className="w-6 h-6 text-indigo-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Desktop Installation Instructions
                </h2>
              </div>
              {installSupported && (
                <button
                  onClick={installApp}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Install
                </button>
              )}
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>Follow these steps to install Budget Tracker on your desktop:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Open Budget Tracker in <strong>Chrome</strong>, <strong>Edge</strong>, or another compatible browser</li>
                <li>Look for the install icon (<FiDownload className="inline w-4 h-4" />) in the address bar</li>
                <li>Click on the icon and select <strong>Install</strong></li>
                <li>Confirm by clicking <strong>Install</strong> in the dialog</li>
                <li>The app will open in its own window and be available in your Start menu or dock</li>
              </ol>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4">
                Note: If you don&apos;t see the install icon, the app might already be installed or your browser might not support installation.
              </p>
            </div>
          </div>
        )}
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h2 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
            Benefits of Installing as an App
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-green-700 dark:text-green-400">
            <li>Access Budget Tracker directly from your home screen or app drawer</li>
            <li>Use the app in full-screen mode without browser navigation</li>
            <li>Get a more native app-like experience</li>
            <li>Some features may work offline</li>
            <li>Faster loading times after initial installation</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 