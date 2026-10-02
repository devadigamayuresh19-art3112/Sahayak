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
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { parseInventoryMessage } from '../services/nlpEngine';

// Generated asset paths
const HERO_IMAGE = '/src/assets/images/sahayak_kirana_hero_1790926926741.jpg';
const AVATAR_1 = '/src/assets/images/shopkeeper_avatar_1_1790926938665.jpg';
const AVATAR_2 = '/src/assets/images/shopkeeper_avatar_2_1790926955487.jpg';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Demo state
  const [demoInput, setDemoInput] = useState('Aaj 20 Maggi aayi aur 5 Pepsi bikli');
  const [demoConfirmed, setDemoConfirmed] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'hinglish' | 'marathi' | 'english'>('hinglish');

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
        colors: ['#61b487', '#2dd4bf', '#ffffff']
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="min-h-screen bg-[#05110b] text-[#f0fdf4] selection:bg-[#61b487] selection:text-[#05110b]">
      {/* 1. Header / Navbar (Strict Top Bar Contract: Brand, Links, Action) */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#05110b]/85 border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Wordmark */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#18583d] border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-lg">
              S
            </div>
            <span>Sahayak</span>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-emerald-200/80">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#interactive-demo" className="hover:text-white transition-colors">Live Demo</a>
            <a href="#impact" className="hover:text-white transition-colors">Kirana Impact</a>
          </nav>

          {/* Zone 3: Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onNavigate('/login')}
              className="text-sm font-medium text-emerald-200/90 hover:text-white transition-colors px-3 py-2 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('/signup')}
              className="px-5 py-2.5 text-sm font-semibold text-[#05110b] bg-[#61b487] hover:bg-[#78c99e] rounded-xl transition-all shadow-[0_0_20px_rgba(97,180,135,0.35)] cursor-pointer hover:scale-102 active:scale-98"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-emerald-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 space-y-3 bg-[#081f15] border-b border-emerald-800/40">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base text-emerald-200 hover:text-white"
            >
              About
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base text-emerald-200 hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base text-emerald-200 hover:text-white"
            >
              Features
            </a>
            <a
              href="#interactive-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base text-emerald-200 hover:text-white"
            >
              Live Demo
            </a>
            <a
              href="#impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base text-emerald-200 hover:text-white"
            >
              Kirana Impact
            </a>
            <div className="pt-4 flex flex-col gap-2 border-t border-emerald-900/50">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/login'); }}
                className="w-full py-2.5 text-center text-emerald-300 border border-emerald-700/50 rounded-lg font-medium"
              >
                Login
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/signup'); }}
                className="w-full py-2.5 text-center text-[#05110b] bg-[#61b487] font-semibold rounded-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/25 text-xs text-emerald-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next-Gen WhatsApp-Style Inventory for Retail</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Manage Your Inventory. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#61b487] to-[#2dd4bf]">
                  Just Send a Message.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-emerald-100/75 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Sahayak turns everyday messages and voice notes into organized inventory records — without complicated POS software.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => onNavigate('/signup')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-[#05110b] bg-[#61b487] hover:bg-[#76c89c] transition-all duration-200 shadow-[0_0_28px_rgba(97,180,135,0.4)] flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#interactive-demo"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-semibold text-emerald-200 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Trust markers */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-emerald-400/80 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#61b487]" />
                  <span>Hindi · Marathi · English</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#61b487]" />
                  <span>Real-Time Stock Audits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#61b487]" />
                  <span>Zero POS Training Required</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Transformation Flow Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl glass-panel p-6 shadow-2xl border border-emerald-500/20">
                {/* Language Switcher for Showcase */}
                <div className="flex items-center justify-between pb-4 border-b border-emerald-800/40 text-xs">
                  <span className="text-emerald-400/80 font-semibold uppercase tracking-wider">Live Conversion Flow</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveLangTab('hinglish')}
                      className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${activeLangTab === 'hinglish' ? 'bg-[#18583d] text-white' : 'text-emerald-400/70 hover:text-white'}`}
                    >
                      Hinglish
                    </button>
                    <button
                      onClick={() => setActiveLangTab('marathi')}
                      className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${activeLangTab === 'marathi' ? 'bg-[#18583d] text-white' : 'text-emerald-400/70 hover:text-white'}`}
                    >
                      मराठी
                    </button>
                    <button
                      onClick={() => setActiveLangTab('english')}
                      className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${activeLangTab === 'english' ? 'bg-[#18583d] text-white' : 'text-emerald-400/70 hover:text-white'}`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Step A: Shopkeeper Message */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-400/80 font-medium">
                    <span>SHOPKEEPER MESSAGE</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-500">
                      <Mic className="w-3 h-3" /> Voice / Text
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-600/30 text-white font-medium text-sm flex items-center justify-between">
                    <span>
                      {activeLangTab === 'hinglish' && '"Aaj 20 Maggi aayi"'}
                      {activeLangTab === 'marathi' && '"20 Maggi आली"'}
                      {activeLangTab === 'english' && '"Received 20 Maggi packets"'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-800/80 text-emerald-200">Sent 09:15</span>
                  </div>
                </div>

                {/* Downward Transform Arrow */}
                <div className="my-3 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#18583d] border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>

                {/* Step B: Sahayak AI NLP Parser */}
                <div className="p-3.5 rounded-xl bg-[#081a13] border border-emerald-700/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Sahayak NLP Engine
                    </span>
                    <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">98% Confidence</span>
                  </div>
                  <div className="text-xs text-emerald-200/70">
                    Product: <strong className="text-white">Maggi 2-Minute</strong> · Action: <strong className="text-emerald-400">Stock In</strong> · Qty: <strong className="text-white">+20</strong>
                  </div>
                </div>

                {/* Downward Transform Arrow */}
                <div className="my-3 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">
                    ↓
                  </div>
                </div>

                {/* Step C: Structured Inventory Updated */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#0d3d29] to-[#072417] border border-emerald-400/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-400 text-[#05110b] flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <span className="font-bold text-white text-sm">Maggi 2-Minute Noodles</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-300 text-sm">+20 units</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-300/80 pt-1 border-t border-emerald-700/30">
                    <span>Stock In (Supplier Arrived)</span>
                    <span>New Balance: <strong className="text-white font-mono">24</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kirana Store Photo Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative rounded-3xl overflow-hidden border border-emerald-800/40 shadow-2xl">
          <img
            src={HERO_IMAGE}
            alt="Traditional Indian Kirana Store modern retail"
            referrerPolicy="no-referrer"
            className="w-full h-72 sm:h-96 object-cover filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05110b] via-[#05110b]/50 to-transparent" />
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Built For The Real World</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Empowering India&apos;s 13 Million Kirana Storekeepers
              </h3>
              <p className="text-sm sm:text-base text-emerald-200/80 mt-1">
                No desktop required. No barcodes to configure. Just open Sahayak on your phone and speak.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/signup')}
              className="px-6 py-3 rounded-xl bg-[#61b487] text-[#05110b] font-semibold text-sm hover:bg-[#79cfa0] transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              Create Free Shop
            </button>
          </div>
        </div>
      </section>

      {/* 3. About Section: Traditional vs Sahayak Comparison */}
      <section id="about" className="py-20 bg-[#081a13]/60 border-y border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">The Kirana Bottleneck</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Traditional Inventory Tools Fail Local Retailers
            </h3>
            <p className="mt-4 text-emerald-200/75 text-base sm:text-lg">
              Shopkeepers are busy greeting customers and packing goods. Sitting at an Excel sheet or barcode terminal is impossible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Traditional Method Card */}
            <div className="rounded-2xl p-8 bg-red-950/20 border border-red-900/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-red-400 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center font-bold">
                    ✕
                  </div>
                  <h4 className="text-xl font-bold text-white">Traditional Method</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">01.</span>
                    <p className="text-sm text-red-200/80">
                      <strong>Paper Notebooks (Khaata):</strong> Scribbled receipts and memory notes prone to getting lost, stained, or misread.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">02.</span>
                    <p className="text-sm text-red-200/80">
                      <strong>Manual Counting:</strong> Hours wasted every Sunday manually recounting dusty crates and milk pouches.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">03.</span>
                    <p className="text-sm text-red-200/80">
                      <strong>Stock-Out Surprises:</strong> Finding out popular items are sold out only when an impatient customer asks.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">04.</span>
                    <p className="text-sm text-red-200/80">
                      <strong>Complicated POS:</strong> Heavy software with 100 confusing buttons designed for supermarkets, not kirana.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-red-900/40 text-xs text-red-400/90 font-medium">
                Result: 12+ lost hours weekly, inventory inaccuracies, customer dissatisfaction.
              </div>
            </div>

            {/* Sahayak Method Card */}
            <div className="rounded-2xl p-8 bg-gradient-to-br from-[#0d3d29]/80 to-[#081f15] border border-emerald-500/30 flex flex-col justify-between glow-green">
              <div>
                <div className="flex items-center gap-3 text-emerald-400 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/50 flex items-center justify-center font-bold text-[#61b487]">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-white">The Sahayak Solution</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold">01.</span>
                    <p className="text-sm text-emerald-100/90">
                      <strong>Everyday Natural Messages:</strong> Speak or type in conversational Hindi, Hinglish, Marathi, or English.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold">02.</span>
                    <p className="text-sm text-emerald-100/90">
                      <strong>Instant AI Intent Parsing:</strong> Automatically determines whether goods came in or went out with 96%+ accuracy.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold">03.</span>
                    <p className="text-sm text-emerald-100/90">
                      <strong>Automatic Low-Stock Alerts:</strong> Real-time warnings when items like Maggi or Tata Salt drop below minimums.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold">04.</span>
                    <p className="text-sm text-emerald-100/90">
                      <strong>AI Daily Smart Summary:</strong> At day&apos;s end, Sahayak calculates total sales, top products, and reorders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-700/40 text-xs text-emerald-300 font-medium">
                Result: Zero bookkeeping fatigue, accurate audits, 100% natural interaction.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works (4 Clean Steps) */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">Simplicity First</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How Sahayak Works in 4 Steps</h3>
          <p className="mt-3 text-emerald-200/70 text-base">
            No training needed. If you know how to send a WhatsApp message, you already know Sahayak.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="rounded-2xl glass-panel p-6 border border-emerald-800/40 hover:border-emerald-500/40 transition-all">
            <span className="text-xs font-mono text-emerald-400/80 font-bold tracking-widest">STEP 01</span>
            <div className="w-12 h-12 rounded-xl bg-[#18583d]/60 border border-emerald-500/30 flex items-center justify-center my-4 text-emerald-300">
              <Mic className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Send</h4>
            <p className="text-sm text-emerald-200/75 leading-relaxed">
              Shopkeeper sends a simple text or voice message as stock arrives or leaves.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl glass-panel p-6 border border-emerald-800/40 hover:border-emerald-500/40 transition-all">
            <span className="text-xs font-mono text-emerald-400/80 font-bold tracking-widest">STEP 02</span>
            <div className="w-12 h-12 rounded-xl bg-[#18583d]/60 border border-emerald-500/30 flex items-center justify-center my-4 text-emerald-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Understand</h4>
            <p className="text-sm text-emerald-200/75 leading-relaxed">
              Sahayak identifies the product, quantity, unit, and direction (Stock In vs Stock Out).
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl glass-panel p-6 border border-emerald-800/40 hover:border-emerald-500/40 transition-all">
            <span className="text-xs font-mono text-emerald-400/80 font-bold tracking-widest">STEP 03</span>
            <div className="w-12 h-12 rounded-xl bg-[#18583d]/60 border border-emerald-500/30 flex items-center justify-center my-4 text-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Confirm</h4>
            <p className="text-sm text-emerald-200/75 leading-relaxed">
              Clear preview ensures complete peace of mind. Edit with one tap if needed.
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl glass-panel p-6 border border-emerald-800/40 hover:border-emerald-500/40 transition-all">
            <span className="text-xs font-mono text-emerald-400/80 font-bold tracking-widest">STEP 04</span>
            <div className="w-12 h-12 rounded-xl bg-[#18583d]/60 border border-emerald-500/30 flex items-center justify-center my-4 text-emerald-300">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Update</h4>
            <p className="text-sm text-emerald-200/75 leading-relaxed">
              Balances, audit logs, and low-stock alerts update automatically across all devices.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Features Section (8 Cards) */}
      <section id="features" className="py-20 bg-[#081a13]/50 border-y border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">Engineered for Indian Commerce</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Full-Stack Features Built for Everyday Kirana</h3>
            <p className="mt-3 text-emerald-200/70 text-base">
              Every feature solves a specific daily friction experienced in neighborhood retail stores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="rounded-2xl glass-panel p-6 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-emerald-300 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Natural Language</h4>
              <p className="text-xs text-emerald-200/75 leading-relaxed">
                Update stock using everyday phrases like &quot;Aaj 20 Maggi aayi&quot; without typing SKUs.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl glass-panel p-6 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-emerald-300 mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Voice Input</h4>
              <p className="text-xs text-emerald-200/75 leading-relaxed">
                Tap the mic, speak naturally while packing goods, and let Sahayak record the stock.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl glass-panel p-6 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-emerald-300 mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Multilingual</h4>
              <p className="text-xs text-emerald-200/75 leading-relaxed">
                Seamless architecture supporting Hindi, Marathi, Hinglish, and English interchangeably.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl glass-panel p-6 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-emerald-300 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Smart Stock Updates</h4>
              <p className="text-xs text-emerald-200/75 leading-relaxed">
                Understands multiple compound items in a single message with automatic arithmetic.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-2xl glass-panel p-6 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-emerald-300 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Low Stock Alerts</h4>
              <p className="text-xs text-emerald-200/75 leading-relaxed">
                Proactively notifies when inventory drops below safety buffers to prevent lost sales.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-2xl glass-panel p-6 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-emerald-300 mb-4">
                <History className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Transaction History</h4>
              <p className="text-xs text-emerald-200/75 leading-relaxed">
                Maintains an automatic timestamped audit trail with instant 1-click Undo protection.
              </p>
            </div>

            {/* Card 7 */}
            <div className="rounded-2xl glass-panel p-6 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-emerald-300 mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Visual Analytics</h4>
              <p className="text-xs text-emerald-200/75 leading-relaxed">
                Clear graphs of daily turnover, top-selling items, and seasonal stock movements.
              </p>
            </div>

            {/* Card 8 */}
            <div className="rounded-2xl glass-panel p-6 glass-panel-hover">
              <div className="w-10 h-10 rounded-xl bg-[#18583d] flex items-center justify-center text-emerald-300 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Daily AI Summary</h4>
              <p className="text-xs text-emerald-200/75 leading-relaxed">
                Generates actionable human summaries based purely on real transaction records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive Demo Section (Visual Highlight) */}
      <section id="interactive-demo" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Test the Engine</span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Interactive Assistant Simulator</h3>
          <p className="mt-3 text-emerald-200/75 text-sm sm:text-base">
            Click any test message below or type your own to see how Sahayak breaks down compound inventory instructions.
          </p>
        </div>

        {/* Simulator Box */}
        <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-emerald-500/30 shadow-2xl relative">
          {/* Quick Presets */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-emerald-400/80 font-medium">Try phrase:</span>
            <button
              onClick={() => handleRunDemo('Aaj 20 Maggi aayi aur 5 Pepsi bikli')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700/50 text-xs text-emerald-200 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
            >
              &quot;Aaj 20 Maggi aayi aur 5 Pepsi bikli&quot;
            </button>
            <button
              onClick={() => handleRunDemo('10 Parle-G add karo')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700/50 text-xs text-emerald-200 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
            >
              &quot;10 Parle-G add karo&quot;
            </button>
            <button
              onClick={() => handleRunDemo('20 Maggi आली आणि 5 Pepsi विकल्या')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700/50 text-xs text-emerald-200 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
            >
              &quot;20 Maggi आली आणि 5 Pepsi विकल्या&quot; (Marathi)
            </button>
          </div>

          {/* Interactive Chat Bubble Representation */}
          <div className="space-y-6">
            {/* Shopkeeper Message Bubble */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-900 border border-emerald-600/40 flex items-center justify-center text-xs font-bold text-white shrink-0">
                You
              </div>
              <div className="flex-1">
                <div className="inline-block p-4 rounded-2xl rounded-tl-none bg-[#0a271c] border border-emerald-600/30 text-white font-medium text-base shadow-sm">
                  &ldquo;{demoInput}&rdquo;
                </div>
              </div>
            </div>

            {/* Sahayak AI Response */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#18583d] border border-emerald-400/50 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
                AI
              </div>
              <div className="flex-1 space-y-4">
                <div className="inline-block p-4 rounded-2xl rounded-tl-none bg-[#061810] border border-emerald-500/25 text-emerald-100 text-sm">
                  <div className="flex items-center gap-2 mb-2 text-xs text-emerald-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sahayak NLP parsed {parsedDemo.intents.length} inventory update{parsedDemo.intents.length === 1 ? '' : 's'}</span>
                    <span className="font-mono text-[10px] bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-300">
                      {(parsedDemo.overallConfidence * 100).toFixed(0)}% Match
                    </span>
                  </div>

                  {/* Parsed Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {parsedDemo.intents.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border ${item.operation === 'stock_in' ? 'bg-emerald-950/60 border-emerald-500/30' : 'bg-red-950/40 border-red-500/30'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{item.productName}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded font-mono ${item.operation === 'stock_in' ? 'bg-emerald-800/80 text-emerald-200' : 'bg-red-800/80 text-red-200'}`}>
                            {item.operation === 'stock_in' ? `+${item.quantity}` : `-${item.quantity}`} {item.unit}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-emerald-300/80 flex items-center gap-1.5">
                          <span>{item.operation === 'stock_in' ? 'Stock In (Incoming)' : 'Stock Out (Sold)'}</span>
                          <span>·</span>
                          <span className="text-emerald-400">{(item.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Confirmation / Success State */}
                  <div className="mt-5 pt-4 border-t border-emerald-800/40 flex items-center justify-between flex-wrap gap-3">
                    {!demoConfirmed ? (
                      <>
                        <span className="text-xs text-emerald-300/80">Confirm updates to apply to store database?</span>
                        <button
                          onClick={handleConfirmDemo}
                          className="px-5 py-2.5 rounded-xl bg-[#61b487] text-[#05110b] font-semibold text-xs hover:bg-[#79ce9f] transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-102"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Updates</span>
                        </button>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-900/60 border border-emerald-400/40 text-emerald-200 text-xs font-medium">
                        <div className="flex items-center gap-2 text-emerald-300 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-[#61b487]" />
                          <span>✓ Inventory Updated Successfully in Database</span>
                        </div>
                        <button
                          onClick={() => setDemoConfirmed(false)}
                          className="text-xs text-emerald-400 underline hover:text-white cursor-pointer"
                        >
                          Reset
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

      {/* 7. Impact Section (Kirana Stories) */}
      <section id="impact" className="py-20 bg-[#081a13]/70 border-y border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Real Storekeeper Impact</span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                No Spreadsheets. No POS Courses. Just Communicate.
              </h3>
              <p className="text-base text-emerald-200/80 leading-relaxed">
                Designed for neighborhood grocers, family-run kiosks, and retail storekeepers who cannot afford to waste hours learning complex software.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 text-[#61b487] flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-emerald-100">Kirana stores & general provision stores</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 text-[#61b487] flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-emerald-100">Dairy & bakery counters</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 text-[#61b487] flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-emerald-100">Small pharmacies & neighborhood retail</span>
                </div>
              </div>
            </div>

            {/* Testimonial Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Testimonial 1 */}
              <div className="rounded-2xl glass-panel p-6 border border-emerald-800/40 flex flex-col justify-between">
                <p className="text-sm text-emerald-100/90 italic leading-relaxed">
                  &ldquo;Pehle dukan band karke 1 ghanta diary likhta tha. Now as soon as delivery arrives, I just speak into Sahayak. It has saved me 6 hours every week.&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-emerald-800/40">
                  <img
                    src={AVATAR_1}
                    alt="Ramesh Sharma"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-white">Ramesh Sharma</h5>
                    <p className="text-xs text-emerald-400/80">Sharma Kirana Store, Pune</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="rounded-2xl glass-panel p-6 border border-emerald-800/40 flex flex-col justify-between">
                <p className="text-sm text-emerald-100/90 italic leading-relaxed">
                  &ldquo;The low stock alerts on Maggi and milk packets prevent me from turning customers away. I can use Marathi or Hindi without any trouble.&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-emerald-800/40">
                  <img
                    src={AVATAR_2}
                    alt="Pooja Deshmukh"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-white">Pooja Deshmukh</h5>
                    <p className="text-xs text-emerald-400/80">Shree Provision Store, Mumbai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Your shop already speaks. <br />
            <span className="text-[#61b487]">Let Sahayak understand it.</span>
          </h2>
          <p className="text-emerald-200/80 text-base sm:text-lg max-w-xl mx-auto font-normal">
            Join thousands of smart retailers simplifying their daily stock tracking in under 60 seconds.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/signup')}
              className="px-8 py-4 rounded-xl text-base font-semibold text-[#05110b] bg-[#61b487] hover:bg-[#78cca0] transition-all shadow-[0_0_30px_rgba(97,180,135,0.45)] cursor-pointer hover:scale-103 active:scale-98"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* 9. Minimal Footer */}
      <footer className="py-8 border-t border-emerald-900/40 text-center text-xs text-emerald-500/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Sahayak</span>
            <span>· Your Inventory Assistant, Just a Message Away</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/')} className="hover:text-emerald-300">3D Intro</button>
            <button onClick={() => onNavigate('/login')} className="hover:text-emerald-300">Login</button>
            <button onClick={() => onNavigate('/signup')} className="hover:text-emerald-300">Sign Up</button>
          </div>
          <div>© {new Date().getFullYear()} Sahayak Technologies. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
