import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Store, User, ArrowRight, Globe } from 'lucide-react';
import { authService } from '../services/auth';
import { SahayakLogo } from '../components/common/SahayakLogo';

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
      setErrorMessage('Passwords do not match. Please verify your password.');
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
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative selection:bg-[#61b487] selection:text-white">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 relative z-10 flex flex-col items-center">
        <SahayakLogo
          size="lg"
          showTagline={true}
          onClick={() => onNavigate('/home')}
        />
        <h2 className="mt-4 text-2xl font-bold text-[#173127] font-heading">
          Register your shop account
        </h2>
        <p className="mt-1 text-sm text-[#607269]">
          Start recording inventory in natural language in under a minute
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#DCE8E0] shadow-sm">
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Shop Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-name" className="block text-xs font-semibold text-[#173127] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#89988F]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ramesh Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-xs focus-ring focus:border-[#18583d] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-shop" className="block text-xs font-semibold text-[#173127] mb-1">
                  Shop Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#89988F]">
                    <Store className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-shop"
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Sharma Kirana Store"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-xs focus-ring focus:border-[#18583d] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-[#173127] mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#89988F]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@sharmakiranastore.in"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-xs focus-ring focus:border-[#18583d] transition-colors"
                />
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label htmlFor="signup-lang" className="block text-xs font-semibold text-[#173127] mb-1">
                Preferred Voice &amp; Chat Language
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#89988F]">
                  <Globe className="w-4 h-4" />
                </div>
                <select
                  id="signup-lang"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as 'hi-IN' | 'mr-IN' | 'en-IN')}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] text-xs focus-ring focus:border-[#18583d] cursor-pointer"
                >
                  <option value="hi-IN">हिंदी / Hinglish (Hindi)</option>
                  <option value="mr-IN">मराठी (Marathi)</option>
                  <option value="en-IN">English (Indian Retail)</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-pass" className="block text-xs font-semibold text-[#173127] mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#89988F]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-xs focus-ring focus:border-[#18583d] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#89988F] hover:text-[#173127]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm" className="block text-xs font-semibold text-[#173127] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#89988F]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-xs focus-ring focus:border-[#18583d] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#18583d] hover:bg-[#0d3d29] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 focus-ring"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up Shop Account...
                  </span>
                ) : (
                  <>
                    <span>Create Shop Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center text-xs text-[#607269]">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="text-[#18583d] font-bold hover:underline cursor-pointer focus-ring rounded"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
