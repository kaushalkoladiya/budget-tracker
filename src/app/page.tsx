'use client';

// No need for Image import as we're using icons from react-icons
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBarChart2, FiCalendar, FiDollarSign, FiPieChart, FiCheck } from 'react-icons/fi';

import Button from '@/components/ui/Button';
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
      icon: <FiBarChart2 className="w-6 h-6 text-green-500" />,
      imageUrl: '/images/categories.png'
    },
    {
      title: 'Budget Goals',
      description: 'Set and track spending limits for different categories.',
      icon: <FiDollarSign className="w-6 h-6 text-green-500" />,
      imageUrl: '/images/budgets.png'
    },
    {
      title: 'Debt Tracking',
      description: 'Manage borrowed and lent money with payment schedules.',
      icon: <FiCalendar className="w-6 h-6 text-green-500" />,
      imageUrl: '/images/debts.png'
    },
    {
      title: 'Spending Insights',
      description: 'Visualize your financial data with interactive charts.',
      icon: <FiPieChart className="w-6 h-6 text-green-500" />,
      imageUrl: '/images/insights.png'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "This app completely changed how I manage my finances. The budget alerts have saved me from overspending many times.",
      author: "Sarah L.",
      role: "Freelancer"
    },
    {
      quote: "I love how I can track both my expenses and the money friends owe me. The debt reminders are so helpful!",
      author: "Michael T.",
      role: "Student"
    },
    {
      quote: "The spending insights helped me identify where my money was going. I've saved $250 in just the first month!",
      author: "Jamie K.",
      role: "Marketing Specialist"
    }
  ];

  // Stats data
  const stats = [
    { value: "10k+", label: "Active Users" },
    { value: "$2.5M", label: "Money Tracked" },
    { value: "98%", label: "User Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with App Showcase */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[150%] h-[600px] bg-gradient-radial from-green-100/70 to-transparent dark:from-green-900/30 opacity-80 blur-3xl" />
          <div className="absolute -left-64 top-1/4 w-96 h-96 rounded-full bg-green-200/30 dark:bg-green-800/20 blur-3xl" />
          <div className="absolute -right-64 top-2/3 w-96 h-96 rounded-full bg-blue-200/30 dark:bg-blue-800/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-gray-900 dark:to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="max-w-xl"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div
                className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4"
                variants={itemVariants}
              >
                Personal Finance Made Simple
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                variants={itemVariants}
              >
                Take Control of Your <span className="text-green-500 dark:text-green-400">Financial Life</span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                variants={itemVariants}
              >
                Track income, expenses, budgets, and debts with a beautiful experience that works even offline. No more financial stress.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    rightIcon={<FiArrowRight />}
                    className="shadow-lg shadow-green-500/20"
                  >
                    Get Started Free
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
                  See Features
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                className="mt-8 flex items-center gap-2 text-gray-500 dark:text-gray-400"
                variants={itemVariants}
              >
                <FiCheck className="text-green-500" /> No credit card required
                <span className="mx-2">•</span>
                <FiCheck className="text-green-500" /> Works offline
                <span className="mx-2">•</span>
                <FiCheck className="text-green-500" /> PWA enabled
              </motion.div>
            </motion.div>

            {/* App Preview/Mockup */}
            <motion.div
              className="relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full max-w-md">
                {/* Phone Frame */}
                <div className="relative mx-auto w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-[14px] border-gray-800 shadow-2xl overflow-hidden">
                  {/* Screen Content - Replace with your actual app screenshot */}
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                    {/* This is where you'd put a screenshot of your app */}
                    <div className="h-full w-full bg-gradient-to-b from-green-400 to-green-600 flex flex-col">
                      {/* Replace with Image component once you have a screenshot */}
                      <div className="h-14 bg-green-500 flex items-center justify-center">
                        <div className="text-white font-medium">Dashboard</div>
                      </div>
                      <div className="flex-1 bg-white dark:bg-gray-800 p-4">
                        <div className="mb-4 h-24 bg-green-50 dark:bg-green-900/20 rounded-xl flex flex-col justify-center items-center">
                          <div className="text-green-600 dark:text-green-400 font-bold text-2xl">$2,450.85</div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">Available Balance</div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                          <div className="h-36 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating UI Elements */}
                <div className="absolute -right-12 top-16 w-48 h-24 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 transform rotate-6">
                  <div className="h-4 w-3/4 bg-green-200 dark:bg-green-700 rounded-full mb-2"></div>
                  <div className="h-8 w-full bg-green-100 dark:bg-green-900/30 rounded-lg"></div>
                </div>
                <div className="absolute -left-16 bottom-24 w-40 h-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 transform -rotate-6">
                  <div className="h-4 w-1/2 bg-blue-200 dark:bg-blue-700 rounded-full mb-2"></div>
                  <div className="h-24 w-full bg-blue-100 dark:bg-blue-900/30 rounded-lg"></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-500 dark:text-green-400">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
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
        </div>
      </section>

      {/* Features Section with Screenshots */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Everything You Need
            </motion.span>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Powerful Features for Complete <span className="text-green-500 dark:text-green-400">Financial Control</span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Everything you need to manage your personal finances effectively.
            </motion.p>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {/* Feature Description */}
                <div className="lg:w-1/2 space-y-6">
                  <div className='flex gap-4 items-center'>
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300">{feature.description}</p>
                  <ul className="space-y-2">
                    {/* Replace with actual feature points */}
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature.title === 'Custom Categories' && 'Create unlimited categories and subcategories'}
                        {feature.title === 'Budget Goals' && 'Set monthly or yearly budget goals'}
                        {feature.title === 'Debt Tracking' && 'Track money you\'ve borrowed or lent'}
                        {feature.title === 'Spending Insights' && 'See where your money goes with visual charts'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature.title === 'Custom Categories' && 'Assign icons and colors for visual recognition'}
                        {feature.title === 'Budget Goals' && 'Get alerts when approaching budget limits'}
                        {feature.title === 'Debt Tracking' && 'Set payment schedules with due date reminders'}
                        {feature.title === 'Spending Insights' && 'Compare expenses across different time periods'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature.title === 'Custom Categories' && 'Organize transactions with smart filtering'}
                        {feature.title === 'Budget Goals' && 'Track progress with visual indicators'}
                        {feature.title === 'Debt Tracking' && 'Track partial payments and outstanding balances'}
                        {feature.title === 'Spending Insights' && 'Identify spending spikes and unusual patterns'}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Feature Screenshot */}
                <div className="lg:w-1/2">
                  <div className="relative mx-auto w-full max-w-md rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {/* Replace with your actual screenshot */}
                    <div className="w-full bg-gray-100 dark:bg-gray-700 p-4">
                      {feature.imageUrl ? (
                        <Image
                          src={feature.imageUrl}
                          alt={feature.title}
                          width={500}
                          height={900}
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          Screenshot: {feature.title}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              User Stories
            </motion.span>

            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              What Our Users Are Saying
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-green-500 text-4xl mb-4">&ldquo;</div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-500 font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 dark:text-white font-medium">{testimonial.author}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PWA Install Prompt - Improved Version */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
                  Install on Any Device
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Take Budget Tracker Everywhere</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Get quick access to your finances from any device, even offline. No app store required!</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiCheck className="text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Works offline - track finances anywhere</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCheck className="text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Fast access from your home screen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCheck className="text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Automatic updates with new features</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Button size="lg" className="shadow-lg shadow-green-500/20">Install App Now</Button>
                </div>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 md:p-12 flex items-center justify-center">
                <div className="relative">
                  {/* Desktop mockup */}
                  <div className="w-64 h-40 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="h-5 bg-gray-700 flex items-center px-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="p-2 h-[calc(100%-20px)] bg-white dark:bg-gray-900">
                      <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-sm mb-2"></div>
                      <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Mobile mockup, positioned to overlap desktop */}
                  <div className="absolute -bottom-6 -right-10 w-24 h-40 bg-gray-900 rounded-xl shadow-xl overflow-hidden border-4 border-gray-800">
                    <div className="h-3 bg-gray-800"></div>
                    <div className="h-[calc(100%-12px)] bg-white dark:bg-gray-900 p-1">
                      <div className="w-full h-6 bg-green-100 dark:bg-green-900/30 rounded-sm mb-1"></div>
                      <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-sm mb-1"></div>
                      <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-sm mb-1"></div>
                      <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-green-900/20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of users who have simplified their financial life.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="shadow-lg shadow-green-500/20"
                rightIcon={<FiArrowRight />}
              >
                Get Started — It&apos;s Free
              </Button>
            </Link>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No credit card required. Install it anywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Budget Tracker</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Take control of your finances with our powerful, yet simple budget tracking app.</p>
              <p className="text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} Budget Tracker. All rights reserved.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">Categories</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">Budgets</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">Debt Tracking</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">Insights</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">Dashboard</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">About</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">Help Center</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
