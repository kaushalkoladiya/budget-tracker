'use client';

import React from 'react';
import Navigation from '@/components/layout/Navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation sidebar */}
      <Navigation />
      
      {/* Main content */}
      <main className="flex-1 mx-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
