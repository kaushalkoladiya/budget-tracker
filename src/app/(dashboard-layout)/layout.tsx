'use client';

import React from 'react';
import Navigation from '@/components/layout/Navigation';

// This is a shared layout for all dashboard-related pages
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation sidebar */}
      <div className="fixed left-0 top-0 h-full z-10">
        <Navigation />
      </div>
      
      {/* Main content */}
      <main className="flex-1 mx-auto pt-16 md:pt-0 md:ml-64">
        {children}
      </main>
    </div>
  );
}
