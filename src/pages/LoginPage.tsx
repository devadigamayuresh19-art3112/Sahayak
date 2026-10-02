import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Store } from 'lucide-react';
import { authService } from '../services/auth';

interface LoginPageProps {
  onNavigate: (route: string) => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = authService.login(email, password);
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
        onNavigate('/dashboard');
      } else {
        setErrorMessage(res.error || 'Login failed. Please check credentials.');
      }
    }, 400);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      authService.loginDemoUser();
      setIsLoading(false);
      onLoginSuccess();
      onNavigate('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#05110b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#18583d]/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10">
        <button
          onClick={() => onNavigate('/home')}
          className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight text-white hover:text-emerald-400 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-[#18583d] border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xl">
            S
          </div>
          <span>Sahayak</span>
        </button>
        <p className="mt-2 text-sm text-emerald-200/70">
          Sign in to access your shop&apos;s inventory assistant
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-emerald-500/25 shadow-2xl">
          {/* Quick Demo Login Banner for Hackathon Judges */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#0d3d29] to-[#072417] border border-emerald-400/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#61b487]" />
                <span className="text-xs font-bold text-white">Judge &amp; Evaluator Mode</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-800/80 text-emerald-300">
                1-Click
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1 mb-3">
              Explore pre-loaded store data with Maggi, Pepsi, Parle-G, and active low-stock alerts.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#61b487] hover:bg-[#77c99d] text-[#05110b] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-102 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Login as Ramesh (Kirana Store)</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-900/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0b241b] px-3 text-emerald-400/70 font-semibold tracking-wider">
                Or Sign In With Email
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500/60">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh.sharma@kirana.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-600/60 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500/60">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-600/60 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-500/70 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#61b487] hover:bg-[#78cca0] text-[#05110b] font-bold text-sm transition-all shadow-[0_0_20px_rgba(97,180,135,0.35)] flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#05110b] border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-emerald-200/70">
            Don&apos;t have an account yet?{' '}
            <button
              onClick={() => onNavigate('/signup')}
              className="text-[#61b487] font-semibold hover:underline cursor-pointer"
            >
              Create Shop Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
