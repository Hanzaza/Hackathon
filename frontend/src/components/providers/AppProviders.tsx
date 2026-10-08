'use client';

import React, { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { UIProvider } from '@/context/UIContext';
import Navigation from '@/components/ui/Navigation';
import SplashScreen from '@/components/ui/SplashScreen';
import AuthModal from '@/components/auth/AuthModal';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UIProvider>
        <Suspense fallback={null}>
          <SplashScreen />
        </Suspense>

        <Suspense fallback={null}>
          <Navigation />
        </Suspense>

        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>

        <main className="flex-grow">
          {children}
        </main>
      </UIProvider>
    </AuthProvider>
  );
}
