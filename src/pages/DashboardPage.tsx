import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  History,
  Store,
  Globe,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Database,
  Menu,
  X,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbService } from '../services/db';
import { parseInventoryMessage } from '../services/nlpEngine';
import {
  Alert,
  InventoryTransaction,
  MessageRecord,
  ParsedIntentItem,
  ParsedMessage,
  Product,
  ShopStats,
  UserProfile,
} from '../types';
import { AIInputSection } from '../components/dashboard/AIInputSection';
import { InventoryTable } from '../components/dashboard/InventoryTable';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { AnalyticsOverview } from '../components/dashboard/AnalyticsOverview';
import { PredictedSalesTrendCard } from '../components/dashboard/PredictedSalesTrendCard';
import { AssistantTabContent } from '../components/dashboard/AssistantTabContent';
import { NLPConfirmationModal } from '../components/dashboard/NLPConfirmationModal';
import { SahayakLogo } from '../components/common/SahayakLogo';

interface DashboardPageProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onLogout,
  onNavigate,
}) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'inventory' | 'transactions' | 'assistant' | 'alerts' | 'analytics' | 'settings'
  >('overview');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Store data state
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [stats, setStats] = useState<ShopStats>({
    totalProducts: 0,
    totalStockUnits: 0,
    stockAddedToday: 0,
    stockSoldToday: 0,
    lowStockCount: 0,
  });
  const [dailySummary, setDailySummary] = useState<string>('');

  // NLP Modal & Feedback state
  const [pendingParsedMessage, setPendingParsedMessage] = useState<ParsedMessage | null>(null);
  const [isDuplicateWarning, setIsDuplicateWarning] = useState(false);
  const [prefillNewProduct, setPrefillNewProduct] = useState<{ name: string; quantity: number } | null>(null);

  // Undo and toast feedback
  const [toastNotification, setToastNotification] = useState<{ message: string; canUndo?: boolean } | null>(null);

  // Load and refresh store data
  const refreshData = useCallback(() => {
    const prods = dbService.getProducts(user.user_id);
    const txs = dbService.getTransactions(user.user_id);
    const alrts = dbService.getAlerts(user.user_id);
    const msgs = dbService.getMessages(user.user_id);
    const st = dbService.getStats(user.user_id);
    const sum = dbService.getDailySummary(user.user_id);

    setProducts(prods);
    setTransactions(txs);
    setAlerts(alrts);
    setMessages(msgs);
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
          pendingParsedMessage?.rawText || `Initial stock for ${newProd.name}`,
          'text'
        );
        successCount++;
      }
    }

    setPendingParsedMessage(null);
    refreshData();

    // Trigger subtle success celebration
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#18583d', '#61b487', '#0d3d29']
      });
    } catch {
      // ignore
    }

    setToastNotification({
      message: `✓ Successfully updated ${successCount} item${successCount === 1 ? '' : 's'} in your shop.`,
      canUndo: true,
    });
  };

  // Undo the last transaction
  const handleUndoLast = () => {
    const success = dbService.undoLastTransaction(user.user_id);
    if (success) {
      refreshData();
      setToastNotification({ message: '✓ Reverted last inventory change.' });
    } else {
      setToastNotification({ message: 'No recent transaction to undo.' });
    }
  };

  // Quick direct stock adjustment from table or alerts (+1 or -1)
  const handleQuickAdjust = (productId: string, delta: number) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    const op = delta > 0 ? 'stock_in' : 'stock_out';
    const absQty = Math.abs(delta);

    dbService.recordTransaction(
      user.user_id,
      productId,
      op,
      absQty,
      `Quick adjustment (${delta > 0 ? '+1' : '-1'}) for ${p.name}`,
      'text'
    );

    refreshData();
    setToastNotification({
      message: `✓ Adjusted ${p.name} (${delta > 0 ? '+1' : '-1'})`,
      canUndo: true,
    });
  };

  // Restock from alert
  const handleQuickRestock = (productId: string, productName: string, qty: number) => {
    dbService.recordTransaction(
      user.user_id,
      productId,
      'stock_in',
      qty,
      `Restocked ${qty} units of ${productName} from alert`,
      'text'
    );
    refreshData();
    setToastNotification({
      message: `✓ Restocked +${qty} units of ${productName}`,
      canUndo: true,
    });
  };

  // Load standard Demo catalog
  const handleLoadDemoShop = () => {
    dbService.loadDemoShop(user.user_id);
    refreshData();
    setToastNotification({ message: '✓ Kirana demo catalog and active alerts reloaded.' });
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const exportData = {
      shopkeeper: user,
      catalog: products,
      ledger: transactions,
      activeAlerts: alerts,
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
    <div className="min-h-screen bg-[#F7FAF8] text-[#173127] selection:bg-[#61b487] selection:text-white flex flex-col">
      {/* 1. Header Bar - Clean White with Subtle Border */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-[#DCE8E0] shadow-[0_1px_3px_rgba(23,49,39,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand & Shop Identity */}
          <div className="flex items-center gap-3">
            <SahayakLogo
              size="sm"
              showTagline={false}
              onClick={() => onNavigate('/home')}
            />

            <span className="hidden sm:inline text-[#DCE8E0] font-light">|</span>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0]">
              <Store className="w-4 h-4 text-[#18583d] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-[#173127] truncate max-w-[180px] sm:max-w-xs">
                {user.shop_name}
              </span>
            </div>
          </div>

          {/* Quick Actions (Demo Load + Language + User Profile + Logout) */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Reset Button */}
            <button
              onClick={handleLoadDemoShop}
              title="Loads standard Kirana demo catalog (Maggi, Pepsi, Parle-G, Amul)"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] hover:text-[#18583d] text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:scale-102"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#18583d]" />
              <span>Load Demo Shop</span>
            </button>

            {/* Language indicator */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] text-xs text-[#18583d] font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>{user.preferred_language === 'mr-IN' ? 'मराठी' : user.preferred_language === 'hi-IN' ? 'हिंदी' : 'English'}</span>
            </div>

            {/* User Name Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] text-xs text-[#173127]">
              <User className="w-3.5 h-3.5 text-[#18583d]" />
              <span className="font-semibold hidden md:inline">{user.full_name}</span>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-[#607269] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#173127] hover:text-[#18583d]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification Banner with Undo Option */}
      {toastNotification && (
        <div className="sticky top-18 z-30 bg-[#F0F6F2] border-b border-[#DCE8E0] px-4 py-2.5 text-xs text-[#173127] flex items-center justify-between animate-fade-in shadow-xs">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#18583d]" />
              <span className="font-semibold">{toastNotification.message}</span>
            </div>

            <div className="flex items-center gap-3">
              {toastNotification.canUndo && (
                <button
                  onClick={handleUndoLast}
                  className="px-3 py-1 rounded-lg bg-[#18583d] text-white font-bold text-xs hover:bg-[#0d3d29] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              )}
              <button
                onClick={() => setToastNotification(null)}
                className="text-[#89988F] hover:text-[#173127] cursor-pointer"
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
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-[#18583d] text-white shadow-sm' : 'text-[#607269] hover:text-[#173127] hover:bg-[#F0F6F2]'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'inventory' ? 'bg-[#18583d] text-white shadow-sm' : 'text-[#607269] hover:text-[#173127] hover:bg-[#F0F6F2]'}`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Inventory</span>
            </div>
            <span className={`font-mono text-[11px] ${activeTab === 'inventory' ? 'text-white' : 'text-[#89988F]'}`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'transactions' ? 'bg-[#18583d] text-white shadow-sm' : 'text-[#607269] hover:text-[#173127] hover:bg-[#F0F6F2]'}`}
          >
            <History className="w-4 h-4" />
            <span>Transactions</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'assistant' ? 'bg-[#18583d] text-white shadow-sm' : 'text-[#607269] hover:text-[#173127] hover:bg-[#F0F6F2]'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'alerts' ? 'bg-[#18583d] text-white shadow-sm' : 'text-[#607269] hover:text-[#173127] hover:bg-[#F0F6F2]'}`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className={`w-4 h-4 ${activeTab === 'alerts' ? 'text-white' : 'text-amber-500'}`} />
              <span>Low Stock Alerts</span>
            </div>
            {unreadAlertsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-mono font-bold">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'analytics' ? 'bg-[#18583d] text-white shadow-sm' : 'text-[#607269] hover:text-[#173127] hover:bg-[#F0F6F2]'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-[#18583d] text-white shadow-sm' : 'text-[#607269] hover:text-[#173127] hover:bg-[#F0F6F2]'}`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          {/* Quick Demo Shop Button in Sidebar */}
          <div className="pt-6">
            <button
              onClick={handleLoadDemoShop}
              className="w-full py-2 px-3 rounded-xl bg-[#F0F6F2] hover:bg-[#DCE8E0] border border-[#DCE8E0] text-[#18583d] hover:text-[#0d3d29] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Database className="w-3.5 h-3.5 text-[#18583d]" />
              <span>Reset Demo Shop</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-white border border-[#DCE8E0] rounded-2xl p-4 space-y-2 mb-4 shadow-md">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-semibold ${activeTab === 'overview' ? 'bg-[#18583d] text-white' : 'text-[#173127] bg-[#F0F6F2]'}`}
              >
                Overview
              </button>
              <button
                onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-semibold ${activeTab === 'inventory' ? 'bg-[#18583d] text-white' : 'text-[#173127] bg-[#F0F6F2]'}`}
              >
                Inventory ({products.length})
              </button>
              <button
                onClick={() => { setActiveTab('transactions'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-semibold ${activeTab === 'transactions' ? 'bg-[#18583d] text-white' : 'text-[#173127] bg-[#F0F6F2]'}`}
              >
                Transactions
              </button>
              <button
                onClick={() => { setActiveTab('assistant'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-semibold ${activeTab === 'assistant' ? 'bg-[#18583d] text-white' : 'text-[#173127] bg-[#F0F6F2]'}`}
              >
                AI Assistant
              </button>
              <button
                onClick={() => { setActiveTab('alerts'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-semibold ${activeTab === 'alerts' ? 'bg-[#18583d] text-white' : 'text-[#173127] bg-[#F0F6F2]'}`}
              >
                Alerts {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}
              </button>
              <button
                onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                className={`p-2.5 rounded-xl font-semibold ${activeTab === 'analytics' ? 'bg-[#18583d] text-white' : 'text-[#173127] bg-[#F0F6F2]'}`}
              >
                Analytics
              </button>
              <button
                onClick={() => { handleLoadDemoShop(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl font-semibold bg-[#F0F6F2] text-[#18583d] col-span-2"
              >
                Load Demo Shop
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 space-y-6">
          {/* Header Greeting Section */}
          <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173127] tracking-tight font-heading">
                Good morning, {user.full_name.split(' ')[0]}
              </h2>
              <p className="text-xs sm:text-sm text-[#607269] mt-0.5">
                Here&apos;s what&apos;s happening in your shop today.
              </p>
            </div>

            {/* Undo Last Action shortcut */}
            {transactions.length > 0 && (
              <button
                onClick={handleUndoLast}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#F0F6F2] hover:bg-[#DCE8E0] border border-[#DCE8E0] text-[#173127] hover:text-[#18583d] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-102"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#18583d]" />
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
              {/* Today's Smart AI Summary */}
              <div className="rounded-2xl p-5 bg-gradient-to-r from-[#F0F6F2] via-white to-white border border-[#DCE8E0] shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#18583d]">
                  <Sparkles className="w-4 h-4 text-[#18583d]" />
                  <span>Today&apos;s Smart Summary</span>
                </div>
                <p className="text-sm text-[#173127] font-medium leading-relaxed">
                  {dailySummary}
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('inventory')}
                  className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm cursor-pointer hover:border-[#18583d] transition-all"
                >
                  <span className="text-xs text-[#607269] font-medium">Total Products</span>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#173127] font-mono">
                    {stats.totalProducts}
                  </div>
                  <span className="text-[11px] text-[#89988F] font-mono">Catalog items</span>
                </div>

                <div
                  onClick={() => setActiveTab('transactions')}
                  className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm cursor-pointer hover:border-[#18583d] transition-all"
                >
                  <span className="text-xs text-[#607269] font-medium">Stock Added Today</span>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#18583d] font-mono">
                    +{stats.stockAddedToday}
                  </div>
                  <span className="text-[11px] text-[#89988F] font-mono">Restocked units</span>
                </div>

                <div
                  onClick={() => setActiveTab('transactions')}
                  className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm cursor-pointer hover:border-[#18583d] transition-all"
                >
                  <span className="text-xs text-red-600 font-medium">Stock Sold Today</span>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-red-600 font-mono">
                    -{stats.stockSoldToday}
                  </div>
                  <span className="text-[11px] text-red-600/80 font-mono">Customer sales</span>
                </div>

                <div
                  onClick={() => setActiveTab('alerts')}
                  className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm cursor-pointer hover:border-amber-400 transition-all"
                >
                  <span className="text-xs text-amber-700 font-medium">Low Stock Alerts</span>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
                    {stats.lowStockCount}
                  </div>
                  <span className="text-[11px] text-amber-700 font-mono">Needs reordering</span>
                </div>
              </div>

              {/* Linear Regression Predicted Sales Trend Card */}
              <PredictedSalesTrendCard transactions={transactions} />

              {/* Quick Preview of Recent Transactions & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Movement */}
                <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#173127] flex items-center gap-2 font-heading">
                      <History className="w-4 h-4 text-[#18583d]" />
                      <span>Recent Inventory Activity</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className="text-xs text-[#18583d] hover:underline font-semibold cursor-pointer"
                    >
                      View all ({transactions.length})
                    </button>
                  </div>

                  {transactions.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      className="py-2.5 border-b border-[#DCE8E0] flex items-center justify-between text-xs last:border-0"
                    >
                      <div>
                        <div className="font-semibold text-[#173127]">{t.product_name}</div>
                        <div className="text-[11px] text-[#607269] italic">&ldquo;{t.source_message}&rdquo;</div>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold ${t.type === 'stock_in' ? 'text-[#18583d]' : t.type === 'undo' ? 'text-amber-600' : 'text-red-600'}`}>
                          {t.type === 'stock_in' ? `+${t.quantity}` : `-${t.quantity}`}
                        </span>
                        <div className="text-[10px] text-[#89988F] font-mono">
                          {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Critical Stock Buffers */}
                <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#173127] flex items-center gap-2 font-heading">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>Products Needing Restock</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('alerts')}
                      className="text-xs text-[#18583d] hover:underline font-semibold cursor-pointer"
                    >
                      Alerts ({alerts.length})
                    </button>
                  </div>

                  {products.filter(p => p.quantity <= p.minimum_stock).length === 0 ? (
                    <div className="py-8 text-center text-[#607269] text-xs">
                      All products are comfortably stocked.
                    </div>
                  ) : (
                    products
                      .filter(p => p.quantity <= p.minimum_stock)
                      .slice(0, 4)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="py-2.5 border-b border-[#DCE8E0] flex items-center justify-between text-xs last:border-0"
                        >
                          <div>
                            <div className="font-semibold text-[#173127]">{p.name}</div>
                            <div className="text-[11px] text-amber-700">
                              Current: {p.quantity} {p.unit} (Min: {p.minimum_stock})
                            </div>
                          </div>
                          <button
                            onClick={() => handleQuickRestock(p.id, p.name, 10)}
                            className="px-2.5 py-1 rounded-lg bg-[#18583d] text-white font-bold text-[11px] hover:bg-[#0d3d29] cursor-pointer"
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
              shopName={user.shop_name}
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
              onExportSuccess={(filename) => {
                setToastNotification({ message: `✓ Downloaded inventory records: ${filename}` });
              }}
            />
          )}

          {/* Active Tab View: Transactions */}
          {activeTab === 'transactions' && (
            <TransactionsList
              transactions={transactions}
              shopName={user.shop_name}
              onUndoLast={handleUndoLast}
              onExportSuccess={(filename) => {
                setToastNotification({ message: `✓ Downloaded transaction ledger: ${filename}` });
              }}
            />
          )}

          {/* Active Tab View: AI Assistant Details & Log */}
          {activeTab === 'assistant' && (
            <AssistantTabContent
              messages={messages}
              products={products}
              onSelectPhrase={(phrase) => handleProcessNLPInput(phrase, 'text')}
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
            <div className="max-w-2xl rounded-2xl bg-white p-6 sm:p-8 border border-[#DCE8E0] shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-[#173127] font-heading">Shop &amp; Account Settings</h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#173127] font-semibold mb-1">Shopkeeper Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.full_name}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127]"
                  />
                </div>

                <div>
                  <label className="block text-[#173127] font-semibold mb-1">Store / Kirana Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.shop_name}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127]"
                  />
                </div>

                <div>
                  <label className="block text-[#173127] font-semibold mb-1">Registered Email</label>
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] text-[#173127]"
                  />
                </div>

                <div>
                  <label className="block text-[#173127] font-semibold mb-1">Language Mode</label>
                  <div className="p-3 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] text-[#18583d] font-semibold">
                    {user.preferred_language === 'mr-IN' ? 'मराठी (Marathi Voice & NLP)' : user.preferred_language === 'hi-IN' ? 'हिंदी / Hinglish (Hindi Voice & NLP)' : 'English (Retail)'}
                  </div>
                </div>
              </div>

              {/* Data Export Backup */}
              <div className="pt-4 border-t border-[#DCE8E0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#173127]">Export Shop Backup</h4>
                  <p className="text-xs text-[#607269]">
                    Download full product catalog, transaction ledger, and alerts in standard JSON format.
                  </p>
                </div>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 rounded-xl bg-[#18583d] hover:bg-[#0d3d29] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup</span>
                </button>
              </div>

              {/* Reset to Demo Shop */}
              <div className="pt-4 border-t border-[#DCE8E0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-amber-800">Reset Demo Shop Data</h4>
                  <p className="text-xs text-[#607269]">
                    Reloads fresh demo Kirana inventory with Maggi, Pepsi, Parle-G, and alerts.
                  </p>
                </div>
                <button
                  onClick={handleLoadDemoShop}
                  className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold cursor-pointer shadow-2xs"
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
