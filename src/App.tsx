import React, { useEffect, useState } from 'react';
import { ThreeHeroScene } from './components/ThreeHeroScene';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { authService } from './services/auth';
import { UserProfile } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    // If user is already logged in and at / or /login, could start at dashboard or route from pathname
    const path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');
    return hash || (path === '/' ? '/' : path);
  });

  // Keep route in sync with URL
  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/home');
  };

  // Route Resolver
  if (currentRoute === '/dashboard') {
    if (!currentUser) {
      // Auto-authenticate as demo user if direct access attempted, or route to /login
      const demo = authService.loginDemoUser();
      setCurrentUser(demo);
    }
    return (
      <DashboardPage
        user={currentUser || authService.loginDemoUser()}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  if (currentRoute === '/login') {
    return (
      <LoginPage
        onNavigate={navigate}
        onLoginSuccess={() => {
          setCurrentUser(authService.getCurrentUser());
        }}
      />
    );
  }

  if (currentRoute === '/signup') {
    return (
      <SignupPage
        onNavigate={navigate}
        onSignupSuccess={() => {
          setCurrentUser(authService.getCurrentUser());
        }}
      />
    );
  }

  if (currentRoute === '/home') {
    return <LandingPage onNavigate={navigate} />;
  }

  // Default Page 1: 3D Intro Landing Page ('/')
  return (
    <ThreeHeroScene
      onLetGo={() => navigate('/home')}
    />
  );
}
