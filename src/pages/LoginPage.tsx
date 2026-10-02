import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Store } from 'lucide-react';
import { authService } from '../services/auth';
import { SahayakLogo } from '../components/common/SahayakLogo';

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
      setErrorMessage('Please enter both email address and password.');
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
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#61b487] selection:text-white">
      {/* Top Brand Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10 flex flex-col items-center">
        <SahayakLogo
          size="lg"
          showTagline={true}
          onClick={() => onNavigate('/home')}
        />
        <h2 className="mt-4 text-2xl font-bold text-[#173127] font-heading">
          Welcome back to your shop
        </h2>
        <p className="mt-1 text-sm text-[#607269]">
          Sign in to manage stock and record transactions
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#DCE8E0] shadow-sm">
          {/* Quick Demo Login Banner */}
          <div className="mb-6 p-4 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#173127]">
                <Store className="w-4 h-4 text-[#18583d]" />
                <span>Instant Shop Demo</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white text-[#18583d] font-semibold border border-[#DCE8E0]">
                1-Click
              </span>
            </div>
            <p className="text-xs text-[#607269] mb-3">
              Explore pre-loaded store data with Maggi, Pepsi, Parle-G, and active low-stock alerts.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#18583d] hover:bg-[#0d3d29] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm focus-ring hover:scale-[1.01] active:scale-[0.99]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#61b487]" />
              <span>Login as Ramesh (Kirana Demo)</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DCE8E0]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#89988F] font-medium tracking-wider">
                Or Sign In With Email
              </span>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#173127] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#89988F]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh.sharma@kirana.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-sm focus-ring focus:border-[#18583d] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-[#173127] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#89988F]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-sm focus-ring focus:border-[#18583d] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#89988F] hover:text-[#173127]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#18583d] hover:bg-[#0d3d29] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 focus-ring"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying account...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#607269]">
            Don&apos;t have an account yet?{' '}
            <button
              onClick={() => onNavigate('/signup')}
              className="text-[#18583d] font-bold hover:underline cursor-pointer focus-ring rounded"
            >
              Create Shop Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
