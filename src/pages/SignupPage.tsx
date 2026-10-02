import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Store, User, ArrowRight, Globe } from 'lucide-react';
import { authService } from '../services/auth';

interface SignupPageProps {
  onNavigate: (route: string) => void;
  onSignupSuccess: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onSignupSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'hi-IN' | 'mr-IN' | 'en-IN'>('hi-IN');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !shopName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required shop and account details.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = authService.signup(fullName, shopName, email, password, preferredLanguage);
      setIsLoading(false);
      if (res.success) {
        onSignupSuccess();
        onNavigate('/dashboard');
      } else {
        setErrorMessage(res.error || 'Registration failed.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#05110b] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#18583d]/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10">
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
          Create your retail shop profile in 30 seconds
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-emerald-500/25 shadow-2xl">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Shop Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500/60">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ramesh Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-600/60 text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Shop Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500/60">
                    <Store className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Sharma Kirana Store"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-600/60 text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500/60">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@sharmakiranastore.in"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-600/60 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label className="block text-xs font-semibold text-emerald-300 mb-1">
                Preferred Voice &amp; Chat Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500/60">
                  <Globe className="w-4 h-4" />
                </div>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as 'hi-IN' | 'mr-IN' | 'en-IN')}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="hi-IN" className="bg-[#081a13] text-white">हिंदी / Hinglish (Hindi)</option>
                  <option value="mr-IN" className="bg-[#081a13] text-white">मराठी (Marathi)</option>
                  <option value="en-IN" className="bg-[#081a13] text-white">English (Indian Retail)</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-600/60 text-xs focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-emerald-500/70 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-600/60 text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#61b487] hover:bg-[#78cca0] text-[#05110b] font-bold text-sm transition-all shadow-[0_0_20px_rgba(97,180,135,0.35)] flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#05110b] border-t-transparent rounded-full animate-spin" />
                    Setting up Shop Account...
                  </span>
                ) : (
                  <>
                    <span>Create Shop &amp; Start</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center text-xs text-emerald-200/70">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="text-[#61b487] font-semibold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
