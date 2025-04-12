'use client';

// No need for Image import as we're using icons from react-icons
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBarChart2, FiCalendar, FiDollarSign, FiPieChart } from 'react-icons/fi';

import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { hasExistingData } from '@/lib/storage/localStorage';

export default function Home() {
  const [hasData, setHasData] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if user has existing data once component is mounted
  useEffect(() => {
    setMounted(true);
    setHasData(hasExistingData());
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  // Feature cards data
  const features = [
    {
      title: 'Custom Categories',
      description: 'Organize your finances with personalized categories and subcategories.',
      icon: <FiBarChart2 className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Budget Goals',
      description: 'Set and track spending limits for different categories.',
      icon: <FiDollarSign className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Debt Tracking',
      description: 'Manage borrowed and lent money with payment schedules.',
      icon: <FiCalendar className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Spending Insights',
      description: 'Visualize your financial data with interactive charts.',
      icon: <FiPieChart className="w-6 h-6 text-green-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-radial from-green-100/50 to-transparent dark:from-green-900/20 opacity-60 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              variants={itemVariants}
            >
              Take Control of Your Finances
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              variants={itemVariants}
            >
              Track income, expenses, budgets, and debts—all in one place.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  rightIcon={<FiArrowRight />}
                >
                  Get Started
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </motion.div>
            
            {/* Quick access for returning users */}
            {mounted && hasData && (
              <motion.div 
                className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-md mx-auto"
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome back!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Continue managing your finances</p>
                <Link href="/dashboard">
                  <Button fullWidth>Go to Dashboard</Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Everything you need to manage your personal finances effectively.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card isHoverable className="h-full">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PWA Install Prompt */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Install Budget Tracker</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Get quick access to your finances from any device, even offline.</p>
                <Button variant="secondary">Install App</Button>
              </div>
              <div className="md:w-1/2 bg-green-50 dark:bg-green-900/20 p-8 md:p-12 flex items-center justify-center">
                <div className="w-full max-w-[200px] aspect-[9/16] bg-white dark:bg-gray-800 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="h-8 bg-green-500 flex items-center justify-center text-white text-xs font-medium">Budget Tracker</div>
                    <div className="flex-1 p-2">
                      <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2"></div>
                      <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-2"></div>
                      <div className="w-3/4 h-4 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} Budget Tracker. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">Dashboard</Link>
              <Link href="/settings" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">Settings</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">About</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
