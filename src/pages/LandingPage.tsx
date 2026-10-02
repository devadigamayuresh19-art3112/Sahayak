import React, { useState } from 'react';
import {
  Mic,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Globe2,
  History,
  Sparkles,
  Layers,
  Menu,
  X,
  Play,
  Check,
  Store,
  ShieldCheck,
  Clock,
  ArrowDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { parseInventoryMessage } from '../services/nlpEngine';
import { authService } from '../services/auth';
import { SahayakLogo } from '../components/common/SahayakLogo';

// Real asset paths generated for this app
const HERO_IMAGE = '/src/assets/images/sahayak_kirana_hero_1790926926741.jpg';
const AVATAR_1 = '/src/assets/images/shopkeeper_avatar_1_1790926938665.jpg';
const AVATAR_2 = '/src/assets/images/shopkeeper_avatar_2_1790926955487.jpg';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Demo state
  const [demoInput, setDemoInput] = useState('20 Maggi arrived and 5 Pepsi sold');
  const [demoConfirmed, setDemoConfirmed] = useState(false);

  const parsedDemo = parseInventoryMessage(demoInput);

  const handleRunDemo = (text: string) => {
    setDemoInput(text);
    setDemoConfirmed(false);
  };

  const handleConfirmDemo = () => {
    setDemoConfirmed(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#18583d', '#61b487', '#0d3d29']
      });
    } catch {
      // fallback
    }
  };

  const handleStartDemoDirect = () => {
    authService.loginDemoUser();
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#173127] selection:bg-[#61b487] selection:text-white">
      {/* 1. Header / Navbar - Clean White with subtle border */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#DCE8E0] shadow-[0_1px_3px_rgba(23,49,39,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <SahayakLogo
            size="md"
            showTagline={false}
            onClick={() => onNavigate('/home')}
          />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#607269]">
            <a href="#about" className="hover:text-[#18583d] transition-colors focus-ring rounded-md py-1">About</a>
            <a href="#how-it-works" className="hover:text-[#18583d] transition-colors focus-ring rounded-md py-1">How It Works</a>
            <a href="#features" className="hover:text-[#18583d] transition-colors focus-ring rounded-md py-1">Features</a>
            <a href="#interactive-demo" className="hover:text-[#18583d] transition-colors focus-ring rounded-md py-1">Live Demo</a>
            <a href="#impact" className="hover:text-[#18583d] transition-colors focus-ring rounded-md py-1">Impact</a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="text-sm font-semibold text-[#173127] hover:text-[#18583d] transition-colors px-3 py-2 cursor-pointer focus-ring rounded-xl"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#18583d] hover:bg-[#0d3d29] rounded-xl transition-all shadow-sm cursor-pointer hover:scale-102 active:scale-98 focus-ring"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#173127] hover:text-[#18583d] focus-ring rounded-lg cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 space-y-3 bg-white border-b border-[#DCE8E0] animate-fade-in shadow-lg">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#173127] hover:text-[#18583d]"
            >
              About
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#173127] hover:text-[#18583d]"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#173127] hover:text-[#18583d]"
            >
              Features
            </a>
            <a
              href="#interactive-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#173127] hover:text-[#18583d]"
            >
              Live Demo
            </a>
            <a
              href="#impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#173127] hover:text-[#18583d]"
            >
              Impact
            </a>
            <div className="pt-4 flex flex-col gap-2 border-t border-[#DCE8E0]">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/login'); }}
                className="w-full py-2.5 text-center text-[#173127] border border-[#DCE8E0] hover:bg-[#F0F6F2] rounded-xl font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/signup'); }}
                className="w-full py-2.5 text-center text-white bg-[#18583d] hover:bg-[#0d3d29] font-semibold rounded-xl transition-colors shadow-sm"
              >
                Get Started
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleStartDemoDirect(); }}
                className="w-full py-2.5 text-center text-[#18583d] bg-[#F0F6F2] hover:bg-[#DCE8E0]/70 rounded-xl font-semibold transition-colors"
              >
                Try Demo Mode
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section - Light Background + Clean Typography + Green Accents */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-white via-[#F7FAF8] to-[#F7FAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F6F2] border border-[#DCE8E0] text-xs text-[#18583d] font-semibold">
                <Store className="w-3.5 h-3.5 text-[#18583d]" />
                <span>Sahayak — Your shop. Your stock. Simplified.</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#173127] leading-[1.12] font-heading tracking-tight">
                Manage your shop. <br />
                <span className="text-[#18583d]">Just talk to Sahayak.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#607269] max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Turn everyday shop messages into organized inventory updates, transactions, alerts and insights.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={() => onNavigate('/signup')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-[#18583d] hover:bg-[#0d3d29] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-102 active:scale-98 focus-ring"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleStartDemoDirect}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-[#18583d] bg-white hover:bg-[#F0F6F2] border-2 border-[#18583d] transition-all flex items-center justify-center gap-2 cursor-pointer focus-ring shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#18583d]" />
                  <span>Try Demo</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#607269] font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18583d]" />
                  <span>Hindi · Marathi · English</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18583d]" />
                  <span>Automatic Low Stock Alerts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18583d]" />
                  <span>No POS Training Needed</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Workflow Architecture */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-sm">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#18583d] mb-4 flex items-center justify-between border-b border-[#DCE8E0] pb-3">
                  <span>How Natural Language Converts</span>
                  <span className="text-[11px] font-mono text-[#607269]">Live Architecture</span>
                </div>

                {/* Workflow Step 1: Message */}
                <div className="space-y-1">
                  <div className="text-xs text-[#607269] font-medium flex items-center justify-between">
                    <span>1. SHOPKEEPER MESSAGE</span>
                    <span className="text-[11px] text-[#89988F] font-mono">Voice or Text</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] text-[#173127] font-medium text-sm">
                    &ldquo;20 Maggi arrived and 5 Pepsi sold&rdquo;
                  </div>
                </div>

                <div className="my-2.5 flex justify-center text-[#18583d]">
                  <ArrowDown className="w-4 h-4 text-[#18583d]" />
                </div>

                {/* Workflow Step 2: Sahayak Understands */}
                <div className="space-y-1">
                  <div className="text-xs text-[#607269] font-medium flex items-center justify-between">
                    <span>2. SAHAYAK UNDERSTANDS</span>
                    <span className="text-[11px] font-mono text-[#18583d] font-semibold">NLP Parser 98%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-xs text-[#173127] grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-white border border-[#DCE8E0]">
                      <span className="block font-semibold text-[#173127]">Maggi Noodles</span>
                      <span className="font-mono text-[#18583d] font-bold">+20 units (Stock In)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#DCE8E0]">
                      <span className="block font-semibold text-[#173127]">Pepsi Bottle</span>
                      <span className="font-mono text-red-600 font-bold">−5 units (Stock Out)</span>
                    </div>
                  </div>
                </div>

                <div className="my-2.5 flex justify-center text-[#18583d]">
                  <ArrowDown className="w-4 h-4 text-[#18583d]" />
                </div>

                {/* Workflow Step 3: Confirm */}
                <div className="space-y-1">
                  <div className="text-xs text-[#607269] font-medium flex items-center justify-between">
                    <span>3. CONFIRM</span>
                    <span className="text-[11px] font-mono text-[#89988F]">Shopkeeper Review</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] flex items-center justify-between text-xs">
                    <span className="text-[#173127] font-medium">Ready to update shop ledger?</span>
                    <span className="px-3 py-1 rounded-lg bg-[#18583d] text-white font-bold text-[11px]">
                      [Confirm Update]
                    </span>
                  </div>
                </div>

                <div className="my-2.5 flex justify-center text-[#18583d]">
                  <ArrowDown className="w-4 h-4 text-[#18583d]" />
                </div>

                {/* Workflow Step 4: Inventory Updated */}
                <div className="space-y-1">
                  <div className="text-xs text-[#607269] font-medium">4. INVENTORY UPDATED</div>
                  <div className="p-3 rounded-xl bg-white border border-[#DCE8E0] text-xs text-[#173127] font-medium flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#18583d] shrink-0" />
                    <span>Balances updated · Audit trail logged · Alerts refreshed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kirana Store Photo Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="relative rounded-2xl overflow-hidden border border-[#DCE8E0] shadow-md bg-white">
          <img
            src={HERO_IMAGE}
            alt="Traditional Indian Kirana Store retail interior"
            referrerPolicy="no-referrer"
            className="w-full h-64 sm:h-80 object-cover filter brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d3d29]/90 via-[#0d3d29]/40 to-transparent" />
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-widest text-[#61b487] font-semibold">Practical Storekeeper Technology</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-heading">
                Built for Local Indian Kiranas &amp; Retailers
              </h3>
              <p className="text-sm text-emerald-100 mt-1">
                No barcode scanners to buy. No spreadsheets to configure. Speak or message naturally in your language.
              </p>
            </div>
            <button
              onClick={handleStartDemoDirect}
              className="px-6 py-2.5 rounded-xl bg-white text-[#18583d] font-bold text-sm hover:bg-[#F0F6F2] transition-colors whitespace-nowrap cursor-pointer focus-ring self-start sm:self-auto shadow-sm"
            >
              Explore Demo Shop
            </button>
          </div>
        </div>
      </section>

      {/* 3. About Section: Traditional vs Sahayak Comparison */}
      <section id="about" className="py-20 bg-white border-y border-[#DCE8E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest text-[#18583d] font-bold mb-2">The Kirana Bottleneck</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#173127] font-heading">
              Why Traditional Software Fails Local Retailers
            </h3>
            <p className="mt-3 text-[#607269] text-base">
              Shopkeepers are constantly busy greeting customers, taking orders, and packing items. Traditional spreadsheets and supermarket POS systems are too slow and complicated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Traditional Method Card */}
            <div className="rounded-2xl p-7 bg-[#FFF8F8] border border-red-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-3 text-red-700 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center font-bold text-red-600">
                    ✕
                  </div>
                  <h4 className="text-xl font-bold text-[#173127] font-heading">Traditional Bookkeeping</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">01.</span>
                    <p className="text-sm text-[#607269]">
                      <strong className="text-[#173127]">Paper Notebooks (Khaata):</strong> Scribbled receipts and memory notes prone to stains, page loss, and transcription errors.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">02.</span>
                    <p className="text-sm text-[#607269]">
                      <strong className="text-[#173127]">Manual Counting:</strong> Hours wasted every weekend recounting dusty cartons, bottles, and milk pouches.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">03.</span>
                    <p className="text-sm text-[#607269]">
                      <strong className="text-[#173127]">Stock-Out Surprises:</strong> Finding out Maggi or salt is finished only when an impatient customer is standing at the counter.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">04.</span>
                    <p className="text-sm text-[#607269]">
                      <strong className="text-[#173127]">Complicated POS:</strong> Heavy software with dozens of nested buttons designed for corporate supermarkets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-red-200 text-xs text-red-600 font-medium">
                Result: 10+ lost hours weekly, inventory inaccuracies, lost customer revenue.
              </div>
            </div>

            {/* Sahayak Solution Card */}
            <div className="rounded-2xl p-7 bg-[#F7FAF8] border-2 border-[#18583d] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center gap-3 text-[#18583d] mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#18583d] flex items-center justify-center font-bold text-white">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-[#173127] font-heading">The Sahayak Solution</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[#18583d] font-bold">01.</span>
                    <p className="text-sm text-[#607269]">
                      <strong className="text-[#173127]">Everyday Shop Messages:</strong> Speak or type in conversational English, Hindi, or Marathi while serving customers.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#18583d] font-bold">02.</span>
                    <p className="text-sm text-[#607269]">
                      <strong className="text-[#173127]">Structured Inventory Actions:</strong> Automatically detects stock-in deliveries and stock-out sales with 98% accuracy.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#18583d] font-bold">03.</span>
                    <p className="text-sm text-[#607269]">
                      <strong className="text-[#173127]">Automatic Low-Stock Warnings:</strong> Proactive alerts when essential goods drop below minimum safety thresholds.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#18583d] font-bold">04.</span>
                    <p className="text-sm text-[#607269]">
                      <strong className="text-[#173127]">Data-Driven Daily Summaries:</strong> Actionable daily recaps and predicted sales trends without manual math.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DCE8E0] text-xs text-[#18583d] font-semibold">
                Result: Zero training required, instant stock updates, 100% natural interaction.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works (4 Clean Steps) */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase tracking-widest text-[#18583d] font-bold mb-2">Simplicity First</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#173127] font-heading">How Sahayak Works in 4 Steps</h3>
          <p className="mt-2 text-[#607269] text-base">
            No training needed. If you know how to send a WhatsApp message, you already know Sahayak.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-xs flex flex-col justify-between hover:border-[#18583d] transition-all">
            <div>
              <span className="text-xs font-mono text-[#18583d] font-bold tracking-widest">STEP 01</span>
              <div className="w-11 h-11 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] flex items-center justify-center my-4 text-[#18583d]">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#173127] mb-2 font-heading">Send</h4>
              <p className="text-sm text-[#607269] leading-relaxed">
                Shopkeeper sends a simple text or voice message as supplies arrive or customer sales occur.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-xs flex flex-col justify-between hover:border-[#18583d] transition-all">
            <div>
              <span className="text-xs font-mono text-[#18583d] font-bold tracking-widest">STEP 02</span>
              <div className="w-11 h-11 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] flex items-center justify-center my-4 text-[#18583d]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#173127] mb-2 font-heading">Understand</h4>
              <p className="text-sm text-[#607269] leading-relaxed">
                Sahayak identifies products, quantities, units, and directions (Stock In vs Stock Out).
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-xs flex flex-col justify-between hover:border-[#18583d] transition-all">
            <div>
              <span className="text-xs font-mono text-[#18583d] font-bold tracking-widest">STEP 03</span>
              <div className="w-11 h-11 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] flex items-center justify-center my-4 text-[#18583d]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#173127] mb-2 font-heading">Confirm</h4>
              <p className="text-sm text-[#607269] leading-relaxed">
                A clear preview gives complete peace of mind. Edit or adjust with one tap if necessary.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-xs flex flex-col justify-between hover:border-[#18583d] transition-all">
            <div>
              <span className="text-xs font-mono text-[#18583d] font-bold tracking-widest">STEP 04</span>
              <div className="w-11 h-11 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] flex items-center justify-center my-4 text-[#18583d]">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-[#173127] mb-2 font-heading">Update</h4>
              <p className="text-sm text-[#607269] leading-relaxed">
                Balances, transaction histories, and low-stock alerts update automatically across all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Section (8 Polished Cards) */}
      <section id="features" className="py-20 bg-white border-y border-[#DCE8E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest text-[#18583d] font-bold mb-2">Engineered For Everyday Retail</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#173127] font-heading">Practical Features for Indian Shopkeepers</h3>
            <p className="mt-2 text-[#607269] text-base">
              Every capability is designed to solve a specific friction experienced by neighborhood store owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] hover:border-[#18583d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-white mb-4">
                <Sparkles className="w-5 h-5 text-[#61b487]" />
              </div>
              <h4 className="text-base font-bold text-[#173127] mb-2 font-heading">Natural Language</h4>
              <p className="text-xs text-[#607269] leading-relaxed">
                Update stock using everyday phrases like &quot;20 Maggi arrived&quot; without typing complex SKUs.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] hover:border-[#18583d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-white mb-4">
                <Mic className="w-5 h-5 text-[#61b487]" />
              </div>
              <h4 className="text-base font-bold text-[#173127] mb-2 font-heading">Voice Input</h4>
              <p className="text-xs text-[#607269] leading-relaxed">
                Tap the microphone and speak naturally while packing goods or counting shelves.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] hover:border-[#18583d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-white mb-4">
                <Globe2 className="w-5 h-5 text-[#61b487]" />
              </div>
              <h4 className="text-base font-bold text-[#173127] mb-2 font-heading">Multilingual</h4>
              <p className="text-xs text-[#607269] leading-relaxed">
                Natively understands English, Hindi, and Marathi messages and product terms.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] hover:border-[#18583d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-white mb-4">
                <Layers className="w-5 h-5 text-[#61b487]" />
              </div>
              <h4 className="text-base font-bold text-[#173127] mb-2 font-heading">Compound Messages</h4>
              <p className="text-xs text-[#607269] leading-relaxed">
                Parses multiple products in one sentence (e.g., Maggi in and Pepsi out together).
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] hover:border-[#18583d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-white mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              </div>
              <h4 className="text-base font-bold text-[#173127] mb-2 font-heading">Low Stock Alerts</h4>
              <p className="text-xs text-[#607269] leading-relaxed">
                Categorizes items into Out of Stock, Running Low, and Unread alerts with 1-click restock.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] hover:border-[#18583d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-white mb-4">
                <History className="w-5 h-5 text-[#61b487]" />
              </div>
              <h4 className="text-base font-bold text-[#173127] mb-2 font-heading">Transaction History</h4>
              <p className="text-xs text-[#607269] leading-relaxed">
                Maintains a timestamped audit trail with instant 1-click Undo reversal protection.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] hover:border-[#18583d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-white mb-4">
                <BarChart3 className="w-5 h-5 text-[#61b487]" />
              </div>
              <h4 className="text-base font-bold text-[#173127] mb-2 font-heading">Sales Analytics</h4>
              <p className="text-xs text-[#607269] leading-relaxed">
                Visualizes daily turnover, top-moving items, and linear regression sales forecasts.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] hover:border-[#18583d] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-white mb-4">
                <ShieldCheck className="w-5 h-5 text-[#61b487]" />
              </div>
              <h4 className="text-base font-bold text-[#173127] mb-2 font-heading">Offline CSV Export</h4>
              <p className="text-xs text-[#607269] leading-relaxed">
                Download your complete inventory catalog and transaction logs as Excel-compatible CSVs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Demo Simulator Section */}
      <section id="interactive-demo" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#18583d] font-bold">Test The Assistant</span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#173127] mt-1 font-heading">Interactive Simulator</h3>
          <p className="mt-2 text-[#607269] text-sm sm:text-base">
            Click any phrase below or type your own to test how Sahayak converts natural language into structured actions.
          </p>
        </div>

        {/* Simulator Box */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-[#DCE8E0] shadow-sm relative">
          {/* Preset Buttons */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#607269] font-medium">Try speaking:</span>
            <button
              onClick={() => handleRunDemo('20 Maggi arrived and 5 Pepsi sold')}
              className="px-3 py-1.5 rounded-lg bg-[#F0F6F2] border border-[#DCE8E0] text-xs text-[#173127] hover:border-[#18583d] hover:bg-white transition-colors cursor-pointer"
            >
              &quot;20 Maggi arrived and 5 Pepsi sold&quot;
            </button>
            <button
              onClick={() => handleRunDemo('मॅगी 20 आली आणि पेप्सी 5 विकली')}
              className="px-3 py-1.5 rounded-lg bg-[#F0F6F2] border border-[#DCE8E0] text-xs text-[#173127] hover:border-[#18583d] hover:bg-white transition-colors cursor-pointer"
            >
              &quot;मॅगी 20 आली आणि पेप्सी 5 विकली&quot; (Marathi)
            </button>
            <button
              onClick={() => handleRunDemo('मैगी 10 आई और 3 पेप्सी बिकी')}
              className="px-3 py-1.5 rounded-lg bg-[#F0F6F2] border border-[#DCE8E0] text-xs text-[#173127] hover:border-[#18583d] hover:bg-white transition-colors cursor-pointer"
            >
              &quot;मैगी 10 आई और 3 पेप्सी बिकी&quot; (Hindi)
            </button>
            <button
              onClick={() => handleRunDemo('10 Parle G received')}
              className="px-3 py-1.5 rounded-lg bg-[#F0F6F2] border border-[#DCE8E0] text-xs text-[#173127] hover:border-[#18583d] hover:bg-white transition-colors cursor-pointer"
            >
              &quot;10 Parle G received&quot;
            </button>
          </div>

          {/* Custom Editable Input Bar in Simulator */}
          <div className="mb-6 flex items-center rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] p-1.5 focus-within:border-[#18583d] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#18583d]/15 transition-all">
            <input
              type="text"
              value={demoInput}
              onChange={(e) => {
                setDemoInput(e.target.value);
                setDemoConfirmed(false);
              }}
              aria-label="Test custom shopkeeper phrase"
              placeholder='Type custom Kirana note e.g. "20 Maggi aayi aur 5 Pepsi biki"...'
              className="flex-1 bg-transparent px-3 py-2 text-sm text-[#173127] placeholder-[#89988F] focus:outline-none"
            />
            <span className="hidden sm:inline text-xs text-[#18583d] font-mono font-medium px-3 py-1 bg-white rounded-lg border border-[#DCE8E0]">
              Live NLP Parser
            </span>
          </div>

          {/* Interactive Chat Representation */}
          <div className="space-y-5">
            {/* Shopkeeper Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#18583d] flex items-center justify-center text-xs font-bold text-white shrink-0">
                You
              </div>
              <div className="flex-1">
                <div className="inline-block p-4 rounded-2xl rounded-tl-none bg-[#F0F6F2] border border-[#DCE8E0] text-[#173127] font-medium text-base">
                  &ldquo;{demoInput}&rdquo;
                </div>
              </div>
            </div>

            {/* Sahayak AI Response */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#18583d] text-white flex items-center justify-center text-xs font-bold shrink-0">
                AI
              </div>
              <div className="flex-1 space-y-3">
                <div className="inline-block p-4 rounded-2xl rounded-tl-none bg-white border border-[#DCE8E0] text-[#173127] text-sm w-full shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[#18583d] font-semibold mb-3">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#18583d]" />
                      <span>Sahayak parsed {parsedDemo.intents.length} inventory update{parsedDemo.intents.length === 1 ? '' : 's'}</span>
                    </span>
                    <span className="font-mono text-[10px] bg-[#F0F6F2] px-2 py-0.5 rounded text-[#18583d] border border-[#DCE8E0] font-bold">
                      {(parsedDemo.overallConfidence * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  {/* Parsed Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parsedDemo.intents.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border ${item.operation === 'stock_in' ? 'bg-[#F0F6F2] border-[#DCE8E0]' : 'bg-[#FFF8F8] border-red-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#173127] text-sm">{item.productName}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded font-mono ${item.operation === 'stock_in' ? 'bg-[#18583d] text-white' : 'bg-red-600 text-white'}`}>
                            {item.operation === 'stock_in' ? `+${item.quantity}` : `−${item.quantity}`} {item.unit}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-[#607269] flex items-center gap-1.5">
                          <span>{item.operation === 'stock_in' ? 'Stock In (Arrived)' : 'Stock Out (Sold)'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#18583d] font-semibold">{(item.confidence * 100).toFixed(0)}% match</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Confirmation / Success */}
                  <div className="mt-4 pt-3 border-t border-[#DCE8E0] flex items-center justify-between flex-wrap gap-3">
                    {!demoConfirmed ? (
                      <>
                        <span className="text-xs text-[#607269]">Ready to update shop inventory?</span>
                        <button
                          onClick={handleConfirmDemo}
                          className="px-4 py-2 rounded-xl bg-[#18583d] text-white font-bold text-xs hover:bg-[#0d3d29] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Updates</span>
                        </button>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F0F6F2] border border-[#18583d] text-[#18583d] text-xs font-medium">
                        <div className="flex items-center gap-2 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-[#18583d]" />
                          <span>✓ Inventory updated in shop records</span>
                        </div>
                        <button
                          onClick={() => setDemoConfirmed(false)}
                          className="text-xs text-[#18583d] font-semibold underline hover:text-[#0d3d29] cursor-pointer"
                        >
                          Test Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Impact Section (Kirana Testimonials) */}
      <section id="impact" className="py-20 bg-white border-y border-[#DCE8E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs uppercase tracking-widest text-[#18583d] font-bold">Storekeeper Testimonials</span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#173127] font-heading">
                No Spreadsheets. No POS Courses. Just Communicate.
              </h3>
              <p className="text-base text-[#607269] leading-relaxed">
                Designed for neighborhood grocers, family-run kiosks, and retail storekeepers who cannot afford to waste hours learning complex software.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18583d]" />
                  <span className="text-sm text-[#173127] font-medium">Kirana stores &amp; general provision stores</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18583d]" />
                  <span className="text-sm text-[#173127] font-medium">Dairy, bakery &amp; snack counters</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18583d]" />
                  <span className="text-sm text-[#173127] font-medium">Small retail pharmacies &amp; kiosks</span>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] flex flex-col justify-between shadow-xs">
                <p className="text-sm text-[#173127] italic leading-relaxed">
                  &ldquo;Pehle dukan band karke 1 ghanta diary likhta tha. Now as soon as delivery arrives, I just speak into Sahayak. It has saved me 6 hours every week.&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 pt-3 border-t border-[#DCE8E0]">
                  <img
                    src={AVATAR_1}
                    alt="Ramesh Sharma"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#DCE8E0]"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-[#173127] font-heading">Ramesh Sharma</h5>
                    <p className="text-xs text-[#607269]">Sharma Kirana Store, Pune</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#F7FAF8] p-6 border border-[#DCE8E0] flex flex-col justify-between shadow-xs">
                <p className="text-sm text-[#173127] italic leading-relaxed">
                  &ldquo;The low stock alerts on Maggi and milk prevent me from turning customers away. I can use Marathi or Hindi without any trouble.&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 pt-3 border-t border-[#DCE8E0]">
                  <img
                    src={AVATAR_2}
                    alt="Pooja Deshmukh"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#DCE8E0]"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-[#173127] font-heading">Pooja Deshmukh</h5>
                    <p className="text-xs text-[#607269]">Shree Provision Store, Mumbai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-20 text-center relative overflow-hidden bg-gradient-to-b from-[#F7FAF8] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#173127] tracking-tight font-heading">
            Your shop already speaks. <br />
            <span className="text-[#18583d]">Let Sahayak understand it.</span>
          </h2>
          <p className="text-[#607269] text-base sm:text-lg max-w-xl mx-auto font-normal">
            Join local retailers across India simplifying their daily inventory in seconds.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate('/signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-[#18583d] hover:bg-[#0d3d29] transition-all shadow-sm cursor-pointer hover:scale-102 active:scale-98 focus-ring"
            >
              Get Started Free
            </button>
            <button
              onClick={handleStartDemoDirect}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-semibold text-[#18583d] bg-white hover:bg-[#F0F6F2] border-2 border-[#18583d] transition-all cursor-pointer focus-ring shadow-sm"
            >
              Try Demo Mode
            </button>
          </div>
        </div>
      </section>

      {/* 9. Minimal Footer */}
      <footer className="py-8 border-t border-[#DCE8E0] bg-white text-center text-xs text-[#89988F]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <SahayakLogo size="sm" showTagline={true} />
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/')} className="hover:text-[#18583d] cursor-pointer">3D Intro</button>
            <button onClick={() => onNavigate('/login')} className="hover:text-[#18583d] cursor-pointer">Login</button>
            <button onClick={() => onNavigate('/signup')} className="hover:text-[#18583d] cursor-pointer">Sign Up</button>
            <button onClick={handleStartDemoDirect} className="text-[#18583d] font-semibold hover:underline cursor-pointer">Demo Mode</button>
          </div>
          <div>© {new Date().getFullYear()} Sahayak. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
