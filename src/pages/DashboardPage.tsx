import React, { useEffect, useState, useCallback } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  Globe,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  RotateCcw,
  Settings,
  Sparkles,
  Store,
  User,
  Volume2,
  Menu,
  X,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { authService } from '../services/auth';
import { dbService } from '../services/db';
import { parseInventoryMessage } from '../services/nlpEngine';
import { Alert, InventoryTransaction, NLPOperation, ParsedIntentItem, ParsedMessage, Product, ShopStats, UserProfile } from '../types';
import { AIInputSection } from '../components/dashboard/AIInputSection';
import { NLPConfirmationModal } from '../components/dashboard/NLPConfirmationModal';
import { InventoryTable } from '../components/dashboard/InventoryTable';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { AnalyticsOverview } from '../components/dashboard/AnalyticsOverview';
import { PredictedSalesTrendCard } from '../components/dashboard/PredictedSalesTrendCard';

interface DashboardPageProps {
  user: UserProfile;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'transactions' | 'assistant' | 'alerts' | 'analytics' | 'settings'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Store data state
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<ShopStats>({
    totalProducts: 0,
    stockAddedToday: 0,
    stockSoldToday: 0,
    lowStockCount: 0,
    totalStockUnits: 0,
  });
  const [dailySummary, setDailySummary] = useState('');

  // Active NLP Confirmation Modal State
  const [pendingParsedMessage, setPendingParsedMessage] = useState<ParsedMessage | null>(null);
  const [isDuplicateWarning, setIsDuplicateWarning] = useState(false);
  const [prefillNewProduct, setPrefillNewProduct] = useState<{ name: string; quantity: number } | null>(null);

  // Undo Toast Banner State
  const [toastNotification, setToastNotification] = useState<{ message: string; canUndo?: boolean } | null>(null);

  // Refresh all database state for active user
  const refreshData = useCallback(() => {
    const prods = dbService.getProducts(user.user_id);
    const txs = dbService.getTransactions(user.user_id);
    const alrts = dbService.getAlerts(user.user_id);
    const st = dbService.getStats(user.user_id);
    const sum = dbService.getDailySummary(user.user_id);

    setProducts(prods);
    setTransactions(txs);
    setAlerts(alrts);
    setStats(st);
    setDailySummary(sum);
  }, [user.user_id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle NLP Input Submission from text or voice
  const handleProcessNLPInput = (rawText: string, sourceType: 'voice' | 'text') => {
    const isDup = dbService.isDuplicateMessage(user.user_id, rawText);
    const parsed = parseInventoryMessage(rawText, products);

    // Save message log record
    dbService.saveMessageRecord(user.user_id, {
      raw_text: rawText,
      parsed_intent: parsed.intents,
      confidence: parsed.overallConfidence,
      status: 'pending',
    });

    setIsDuplicateWarning(isDup);
    setPendingParsedMessage(parsed);
  };

  // Confirm and apply updates to database
  const handleConfirmIntents = (finalIntents: ParsedIntentItem[]) => {
    let successCount = 0;

    for (const intent of finalIntents) {
      // Find matching product in catalog or match by name
      let targetProduct = products.find(p => p.id === intent.matchedProductId);
      if (!targetProduct) {
        targetProduct = products.find(p => p.name.toLowerCase() === intent.productName.toLowerCase());
      }

      if (targetProduct) {
        // Record transaction & update quantity
        dbService.recordTransaction(
          user.user_id,
          targetProduct.id,
          intent.operation,
          intent.quantity,
          pendingParsedMessage?.rawText || `${intent.operation} ${intent.quantity} ${intent.productName}`,
          'text'
        );
        successCount++;
      } else {
        // New product created automatically
        const newProd = dbService.addProduct(user.user_id, {
          name: intent.productName,
          category: 'Packaged Food',
          sku: 'SKU-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          quantity: intent.operation === 'stock_in' ? intent.quantity : 0,
          minimum_stock: 5,
          unit: intent.unit || 'packets',
          cost_price: 20,
          selling_price: 25,
        });

        dbService.recordTransaction(
          user.user_id,
          newProd.id,
          intent.operation,
          intent.quantity,
          pendingParsedMessage?.rawText || `Initial stock for ${intent.productName}`,
          'text'
        );
        successCount++;
      }
    }

    setPendingParsedMessage(null);
    refreshData();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#61b487', '#2dd4bf', '#ffffff']
      });
    } catch {
      // no-op
    }

    setToastNotification({
      message: `✓ Inventory updated successfully (${successCount} item${successCount === 1 ? '' : 's'}).`,
      canUndo: true,
    });

    setTimeout(() => {
      setToastNotification(prev => (prev?.canUndo ? prev : null));
    }, 8000);
  };

  // Undo Last Transaction
  const handleUndoLast = () => {
    const res = dbService.undoLastTransaction(user.user_id);
    refreshData();
    setToastNotification({
      message: res.message,
      canUndo: false,
    });
  };

  // Quick Restock from Alert
  const handleQuickRestock = (productId: string, productName: string, qty: number) => {
    dbService.recordTransaction(
      user.user_id,
      productId,
      'stock_in',
      qty,
      `Restocked ${qty} units via alert recommendation`,
      'manual'
    );
    refreshData();
    setToastNotification({
      message: `✓ Restocked +${qty} units of ${productName}.`,
      canUndo: true,
    });
  };

  // Quick inventory table +1 / -1
  const handleQuickAdjust = (productId: string, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const op: NLPOperation = delta > 0 ? 'stock_in' : 'stock_out';
    dbService.recordTransaction(
      user.user_id,
      productId,
      op,
      Math.abs(delta),
      `Manual quick adjustment (${delta > 0 ? '+' : ''}${delta})`,
      'manual'
    );
    refreshData();
  };

  // Load Demo Shop (Requested feature for judges)
  const handleLoadDemoShop = () => {
    dbService.loadDemoShop(user.user_id);
    refreshData();
    setToastNotification({
      message: '✓ Demo Shop Loaded: 8 Indian FMCG products, active transactions & low stock alerts configured.',
      canUndo: false,
    });
  };

  // Export JSON store backup
  const handleExportJSON = () => {
    const exportData = {
      profile: user,
      products,
      transactions,
      alerts,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahayak_backup_${user.shop_name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const unreadAlertsCount = alerts.filter(a => !a.is_read).length;

  return (
    <div className="min-h-screen bg-[#05110b] text-[#f0fdf4] selection:bg-[#61b487] selection:text-[#05110b] flex flex-col">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#05110b]/90 border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand & Shop Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/home')}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#18583d] border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-base">
                S
              </div>
              <span className="hidden sm:inline">Sahayak</span>
            </button>

            <span className="hidden sm:inline text-emerald-800 font-light">|</span>

            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#61b487] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-emerald-200 truncate max-w-[180px] sm:max-w-xs">
                {user.shop_name}
              </span>
            </div>
          </div>

          {/* Quick Actions (Demo Load + Language + User Profile + Logout) */}
          <div className="flex items-center gap-2.5">
            {/* Hackathon Judge 1-Click Setup Button */}
            <button
              onClick={handleLoadDemoShop}
              title="Loads standard Kirana demo catalog (Maggi, Pepsi, Parle-G, Amul)"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:text-white hover:border-emerald-400 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-102"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#61b487]" />
              <span>Load Demo Shop</span>
            </button>

            {/* Language indicator */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#081f15] border border-emerald-800/40 text-[11px] text-emerald-400">
              <Globe className="w-3 h-3" />
              <span>{user.preferred_language === 'mr-IN' ? 'मराठी' : user.preferred_language === 'hi-IN' ? 'हिंदी' : 'English'}</span>
            </div>

            {/* User Name Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081f15] border border-emerald-800/40 text-xs text-white">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium hidden md:inline">{user.full_name}</span>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-emerald-400/80 hover:text-red-400 hover:bg-emerald-950 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-emerald-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification Banner with Undo Option */}
      {toastNotification && (
        <div className="sticky top-18 z-30 bg-[#0d3d29] border-b border-emerald-400/40 px-4 py-2.5 text-xs text-emerald-100 flex items-center justify-between animate-fade-in shadow-md">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#61b487]" />
              <span className="font-medium">{toastNotification.message}</span>
            </div>

            <div className="flex items-center gap-3">
              {toastNotification.canUndo && (
                <button
                  onClick={handleUndoLast}
                  className="px-3 py-1 rounded bg-[#61b487] text-[#05110b] font-bold text-xs hover:bg-[#78cca0] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              )}
              <button
                onClick={() => setToastNotification(null)}
                className="text-emerald-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-56 shrink-0 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-[#18583d] text-white shadow-sm' : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/50'}`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#61b487]" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'inventory' ? 'bg-[#18583d] text-white shadow-sm' : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/50'}`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-[#61b487]" />
              <span>Inventory</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400/80">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'transactions' ? 'bg-[#18583d] text-white shadow-sm' : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/50'}`}
          >
            <History className="w-4 h-4 text-[#61b487]" />
            <span>Transactions</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'assistant' ? 'bg-[#18583d] text-white shadow-sm' : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/50'}`}
          >
            <Sparkles className="w-4 h-4 text-[#61b487]" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'alerts' ? 'bg-[#18583d] text-white shadow-sm' : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/50'}`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low Stock Alerts</span>
            </div>
            {unreadAlertsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-mono">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'analytics' ? 'bg-[#18583d] text-white shadow-sm' : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/50'}`}
          >
            <BarChart3 className="w-4 h-4 text-[#61b487]" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-[#18583d] text-white shadow-sm' : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/50'}`}
          >
            <Settings className="w-4 h-4 text-[#61b487]" />
            <span>Settings</span>
          </button>

          {/* Quick Demo Shop Button in Sidebar */}
          <div className="pt-6">
            <button
              onClick={handleLoadDemoShop}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#0d3d29] to-[#072417] border border-emerald-500/30 text-emerald-200 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#61b487]" />
              <span>Reset Demo Shop</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-[#081f15] border border-emerald-800/40 rounded-2xl p-4 space-y-2 mb-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-medium ${activeTab === 'overview' ? 'bg-[#18583d] text-white' : 'text-emerald-300 bg-emerald-950/40'}`}
              >
                Overview
              </button>
              <button
                onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-medium ${activeTab === 'inventory' ? 'bg-[#18583d] text-white' : 'text-emerald-300 bg-emerald-950/40'}`}
              >
                Inventory ({products.length})
              </button>
              <button
                onClick={() => { setActiveTab('transactions'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-medium ${activeTab === 'transactions' ? 'bg-[#18583d] text-white' : 'text-emerald-300 bg-emerald-950/40'}`}
              >
                Transactions
              </button>
              <button
                onClick={() => { setActiveTab('alerts'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-medium ${activeTab === 'alerts' ? 'bg-[#18583d] text-white' : 'text-emerald-300 bg-emerald-950/40'}`}
              >
                Alerts {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}
              </button>
              <button
                onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-medium ${activeTab === 'analytics' ? 'bg-[#18583d] text-white' : 'text-emerald-300 bg-emerald-950/40'}`}
              >
                Analytics
              </button>
              <button
                onClick={() => { handleLoadDemoShop(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl font-medium bg-[#18583d]/60 text-emerald-200"
              >
                Load Demo
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 space-y-6">
          {/* Header Greeting Section (Mandatory from prompt) */}
          <div className="rounded-3xl glass-panel p-6 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Good morning, {user.full_name.split(' ')[0]}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/75 mt-0.5">
                Here&apos;s what&apos;s happening in your shop today.
              </p>
            </div>

            {/* Undo Last Action shortcut */}
            {transactions.length > 0 && (
              <button
                onClick={handleUndoLast}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-700/40 text-emerald-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Undo Last Update</span>
              </button>
            )}
          </div>

          {/* AI Inventory Assistant Bar (Visible in Overview & Assistant tabs) */}
          {(activeTab === 'overview' || activeTab === 'assistant') && (
            <AIInputSection
              onProcessInput={handleProcessNLPInput}
              preferredLanguage={user.preferred_language}
            />
          )}

          {/* Active Tab View: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Today's Smart AI Summary (Generated strictly from real transactions) */}
              <div className="rounded-2xl p-5 bg-gradient-to-r from-[#0d3d29] to-[#072417] border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4 text-[#61b487]" />
                  <span>Today&apos;s Smart Summary</span>
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">
                  {dailySummary}
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('inventory')}
                  className="rounded-2xl glass-panel p-4 border border-emerald-500/20 cursor-pointer hover:border-emerald-400/40 transition-all"
                >
                  <span className="text-xs text-emerald-400/80 font-medium">Total Products</span>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {stats.totalProducts}
                  </div>
                  <span className="text-[11px] text-emerald-500 font-mono">Catalog items</span>
                </div>

                <div
                  onClick={() => setActiveTab('transactions')}
                  className="rounded-2xl glass-panel p-4 border border-emerald-500/20 cursor-pointer hover:border-emerald-400/40 transition-all"
                >
                  <span className="text-xs text-emerald-400/80 font-medium">Stock Added Today</span>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#61b487] font-mono">
                    +{stats.stockAddedToday}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">Restocked units</span>
                </div>

                <div
                  onClick={() => setActiveTab('transactions')}
                  className="rounded-2xl glass-panel p-4 border border-emerald-500/20 cursor-pointer hover:border-emerald-400/40 transition-all"
                >
                  <span className="text-xs text-emerald-400/80 font-medium">Stock Sold Today</span>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">
                    -{stats.stockSoldToday}
                  </div>
                  <span className="text-[11px] text-red-400/80 font-mono">Customer sales</span>
                </div>

                <div
                  onClick={() => setActiveTab('alerts')}
                  className="rounded-2xl glass-panel p-4 border border-emerald-500/20 cursor-pointer hover:border-emerald-400/40 transition-all"
                >
                  <span className="text-xs text-amber-300 font-medium">Low Stock Alerts</span>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                    {stats.lowStockCount}
                  </div>
                  <span className="text-[11px] text-amber-400/80 font-mono">Needs reordering</span>
                </div>
              </div>

              {/* Linear Regression Predicted Sales Trend Card */}
              <PredictedSalesTrendCard transactions={transactions} />

              {/* Quick Preview of Recent Transactions & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Movement */}
                <div className="rounded-3xl glass-panel p-6 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <History className="w-4 h-4 text-[#61b487]" />
                      <span>Recent Inventory Activity</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className="text-xs text-emerald-400 hover:text-white font-medium"
                    >
                      View all ({transactions.length})
                    </button>
                  </div>

                  {transactions.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      className="py-2.5 border-b border-emerald-900/30 flex items-center justify-between text-xs last:border-0"
                    >
                      <div>
                        <div className="font-semibold text-white">{t.product_name}</div>
                        <div className="text-[11px] text-emerald-400/70 italic">&ldquo;{t.source_message}&rdquo;</div>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold ${t.type === 'stock_in' ? 'text-[#61b487]' : t.type === 'undo' ? 'text-amber-400' : 'text-red-400'}`}>
                          {t.type === 'stock_in' ? `+${t.quantity}` : `-${t.quantity}`}
                        </span>
                        <div className="text-[10px] text-emerald-500 font-mono">
                          {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Critical Stock Buffers */}
                <div className="rounded-3xl glass-panel p-6 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Products Needing Restock</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('alerts')}
                      className="text-xs text-emerald-400 hover:text-white font-medium"
                    >
                      Alerts ({alerts.length})
                    </button>
                  </div>

                  {products.filter(p => p.quantity <= p.minimum_stock).length === 0 ? (
                    <div className="py-8 text-center text-emerald-400/60 text-xs">
                      All products are comfortably stocked.
                    </div>
                  ) : (
                    products
                      .filter(p => p.quantity <= p.minimum_stock)
                      .slice(0, 4)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="py-2.5 border-b border-emerald-900/30 flex items-center justify-between text-xs last:border-0"
                        >
                          <div>
                            <div className="font-semibold text-white">{p.name}</div>
                            <div className="text-[11px] text-amber-400/80">
                              Current: {p.quantity} {p.unit} (Min: {p.minimum_stock})
                            </div>
                          </div>
                          <button
                            onClick={() => handleQuickRestock(p.id, p.name, 10)}
                            className="px-2.5 py-1 rounded bg-[#61b487] text-[#05110b] font-bold text-[11px] hover:bg-[#78cca0]"
                          >
                            +10 Units
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Tab View: Inventory */}
          {activeTab === 'inventory' && (
            <InventoryTable
              products={products}
              onAddProduct={(newProd) => {
                dbService.addProduct(user.user_id, newProd);
                refreshData();
                setToastNotification({ message: `✓ Added ${newProd.name} to shop catalog.` });
              }}
              onUpdateProduct={(id, updates) => {
                dbService.updateProduct(user.user_id, id, updates);
                refreshData();
                setToastNotification({ message: '✓ Product updated.' });
              }}
              onDeleteProduct={(id) => {
                dbService.deleteProduct(user.user_id, id);
                refreshData();
                setToastNotification({ message: 'Product removed from catalog.' });
              }}
              onQuickAdjust={handleQuickAdjust}
              prefillNewProduct={prefillNewProduct}
              onClearPrefill={() => setPrefillNewProduct(null)}
            />
          )}

          {/* Active Tab View: Transactions */}
          {activeTab === 'transactions' && (
            <TransactionsList
              transactions={transactions}
              onUndoLast={handleUndoLast}
            />
          )}

          {/* Active Tab View: Alerts */}
          {activeTab === 'alerts' && (
            <AlertsPanel
              alerts={alerts}
              onMarkAsRead={(alertId) => {
                dbService.markAlertAsRead(user.user_id, alertId);
                refreshData();
              }}
              onMarkAllAsRead={() => {
                dbService.markAllAlertsAsRead(user.user_id);
                refreshData();
              }}
              onQuickRestock={handleQuickRestock}
            />
          )}

          {/* Active Tab View: Analytics */}
          {activeTab === 'analytics' && (
            <AnalyticsOverview
              stats={stats}
              products={products}
              transactions={transactions}
            />
          )}

          {/* Active Tab View: Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 border border-emerald-500/25 space-y-6">
              <h3 className="text-lg font-bold text-white">Shop &amp; Account Settings</h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-emerald-300 font-semibold mb-1">Shopkeeper Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.full_name}
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-semibold mb-1">Store / Kirana Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.shop_name}
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-semibold mb-1">Registered Email</label>
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 rounded-xl bg-[#061810] border border-emerald-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-semibold mb-1">Language Mode</label>
                  <div className="p-3 rounded-xl bg-[#061810] border border-emerald-800 text-emerald-200">
                    {user.preferred_language === 'mr-IN' ? 'मराठी (Marathi Voice & NLP)' : user.preferred_language === 'hi-IN' ? 'हिंदी / Hinglish (Hindi Voice & NLP)' : 'English (Retail)'}
                  </div>
                </div>
              </div>

              {/* Data Export Backup */}
              <div className="pt-4 border-t border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">Export Shop Backup</h4>
                  <p className="text-xs text-emerald-300/70">
                    Download full product catalog, transaction ledger, and alerts in standard JSON format.
                  </p>
                </div>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 rounded-xl bg-[#18583d] hover:bg-[#206f4e] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup</span>
                </button>
              </div>

              {/* Reset to Demo Shop */}
              <div className="pt-4 border-t border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-amber-300">Reset Demo Shop Data</h4>
                  <p className="text-xs text-emerald-300/70">
                    Reloads fresh demo Kirana inventory with Maggi, Pepsi, Parle-G, and alerts.
                  </p>
                </div>
                <button
                  onClick={handleLoadDemoShop}
                  className="px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-600/50 hover:bg-amber-900 text-amber-200 text-xs font-semibold cursor-pointer"
                >
                  Reset Demo Data
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      {pendingParsedMessage && (
        <NLPConfirmationModal
          parsedMessage={pendingParsedMessage}
          existingCatalog={products}
          isDuplicate={isDuplicateWarning}
          onConfirm={handleConfirmIntents}
          onCancel={() => setPendingParsedMessage(null)}
          onAddNewProductRequested={(prodName, qty, op) => {
            setPendingParsedMessage(null);
            setActiveTab('inventory');
            setPrefillNewProduct({ name: prodName, quantity: qty });
          }}
        />
      )}
    </div>
  );
};
