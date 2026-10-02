import React, { useState, useMemo } from 'react';
import {
  History,
  Mic,
  MessageSquare,
  RotateCcw,
  Search,
  ArrowDownRight,
  ArrowUpRight,
  FileSpreadsheet,
  X,
  TrendingUp,
  TrendingDown,
  Layers
} from 'lucide-react';
import { InventoryTransaction } from '../../types';
import { exportTransactionsToCSV } from '../../utils/csvExport';

interface TransactionsListProps {
  transactions: InventoryTransaction[];
  shopName?: string;
  onUndoLast: () => void;
  onExportSuccess?: (filename: string) => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  shopName = 'Sharma Kirana',
  onUndoLast,
  onExportSuccess,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Transactions KPI Metrics
  const summaryMetrics = useMemo(() => {
    const today = new Date().toDateString();
    let todayIn = 0;
    let todayOut = 0;

    transactions.forEach(t => {
      const txDate = new Date(t.created_at).toDateString();
      if (txDate === today) {
        if (t.type === 'stock_in') todayIn += t.quantity;
        else if (t.type === 'stock_out') todayOut += t.quantity;
      }
    });

    return {
      totalCount: transactions.length,
      todayIn,
      todayOut,
      netToday: todayIn - todayOut,
    };
  }, [transactions]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch =
        t.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.source_message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'ALL' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  // Handle CSV Download
  const handleDownloadCSV = () => {
    const filename = exportTransactionsToCSV(filtered, shopName);
    if (onExportSuccess) {
      onExportSuccess(filename);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick KPI Summary Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Ledger Records */}
        <div className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#607269] font-medium">
            <span>Audit Entries</span>
            <History className="w-4 h-4 text-[#18583d]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#173127] font-mono">
            {summaryMetrics.totalCount}
          </div>
          <span className="text-[11px] text-[#89988F] font-mono">Logged movements</span>
        </div>

        {/* Stock Added Today */}
        <div className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#607269] font-medium">
            <span>Today&apos;s Restock</span>
            <TrendingUp className="w-4 h-4 text-[#18583d]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#18583d] font-mono">
            +{summaryMetrics.todayIn}
          </div>
          <span className="text-[11px] text-[#89988F] font-mono">Inward supply units</span>
        </div>

        {/* Stock Sold Today */}
        <div className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-red-600 font-medium">
            <span>Today&apos;s Sales</span>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-red-600 font-mono">
            -{summaryMetrics.todayOut}
          </div>
          <span className="text-[11px] text-red-600/80 font-mono">Outward customer units</span>
        </div>

        {/* Net Daily Balance */}
        <div className="rounded-2xl bg-white p-4 border border-[#DCE8E0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#607269] font-medium">
            <span>Net Inventory Delta</span>
            <Layers className="w-4 h-4 text-[#18583d]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#173127] font-mono">
            {summaryMetrics.netToday >= 0 ? `+${summaryMetrics.netToday}` : summaryMetrics.netToday}
          </div>
          <span className="text-[11px] text-[#89988F] font-mono">Stock flow balance</span>
        </div>
      </div>

      {/* 2. Controls & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#89988F]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or spoken voice text..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] placeholder-[#89988F] text-xs focus:outline-none focus:border-[#18583d] focus:ring-1 focus:ring-[#18583d]/20 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#89988F] hover:text-[#173127]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Action Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white border border-[#DCE8E0] text-[#173127] text-xs focus:outline-none focus:border-[#18583d] cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Movements</option>
            <option value="stock_in">Stock In (Received)</option>
            <option value="stock_out">Stock Out (Sold)</option>
            <option value="adjustment">Manual Adjustments</option>
            <option value="undo">Undo Reversals</option>
          </select>

          {/* Download CSV Button */}
          <button
            onClick={handleDownloadCSV}
            title="Download complete transaction ledger as Excel/Google Sheets compatible CSV"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0F6F2] border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#18583d]" />
            <span>Download CSV</span>
          </button>

          {/* Undo Button */}
          <button
            onClick={onUndoLast}
            title="Reverses the most recent inventory modification"
            className="px-4 py-2.5 rounded-xl bg-[#F0F6F2] hover:bg-[#DCE8E0] border border-[#DCE8E0] text-[#173127] hover:text-[#18583d] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#18583d]" />
            <span>Undo Last Action</span>
          </button>
        </div>
      </div>

      {/* 3. Transactions Table Container */}
      <div className="rounded-2xl bg-white border border-[#DCE8E0] overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-[#607269] space-y-3">
            <History className="w-12 h-12 mx-auto text-[#DCE8E0]" />
            <div>
              <p className="text-sm font-semibold text-[#173127]">No transactions found</p>
              <p className="text-xs text-[#607269] mt-1 max-w-sm mx-auto">
                No movements match your current filter. Send a voice or text message in the assistant to record stock.
              </p>
            </div>
            <button
              onClick={() => { setSearchTerm(''); setFilterType('ALL'); }}
              className="px-4 py-1.5 rounded-lg bg-[#F0F6F2] border border-[#DCE8E0] text-[#173127] text-xs hover:border-[#18583d] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {/* Context Subheader Bar */}
            <div className="px-5 py-2.5 bg-[#F7FAF8] border-b border-[#DCE8E0] flex items-center justify-between text-xs text-[#607269] font-mono">
              <span>Showing {filtered.length} of {transactions.length} audit records</span>
              <span className="hidden sm:inline">Timestamped audit trail · 100% tamper-evident</span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F0F6F2] border-b border-[#DCE8E0] text-[#173127] font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-mono">Timestamp</th>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4">Movement Type</th>
                    <th className="py-3.5 px-4 text-right">Quantity</th>
                    <th className="py-3.5 px-4 text-right">Stock Impact</th>
                    <th className="py-3.5 px-4">Original Message / Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE8E0]">
                  {filtered.map((t) => {
                    const isStockIn = t.type === 'stock_in';
                    const isUndo = t.type === 'undo';
                    const dateObj = new Date(t.created_at);
                    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

                    return (
                      <tr key={t.id} className="hover:bg-[#F7FAF8] transition-colors group">
                        {/* Timestamp */}
                        <td className="py-3.5 px-4 font-mono text-[#607269] whitespace-nowrap">
                          <div className="font-semibold text-[#173127]">{timeStr}</div>
                          <div className="text-[10px] text-[#89988F]">{dateStr}</div>
                        </td>

                        {/* Product */}
                        <td className="py-3.5 px-4 font-semibold text-[#173127] group-hover:text-[#18583d] transition-colors">
                          {t.product_name}
                        </td>

                        {/* Operation */}
                        <td className="py-3.5 px-4">
                          {isUndo ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              <RotateCcw className="w-3 h-3" />
                              Undo Reversal
                            </span>
                          ) : isStockIn ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#18583d] bg-[#EBF6F0] border border-[#DCE8E0] px-2.5 py-0.5 rounded-full">
                              <ArrowDownRight className="w-3 h-3 text-[#18583d]" />
                              Stock In
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                              <ArrowUpRight className="w-3 h-3 text-red-600" />
                              Stock Out
                            </span>
                          )}
                        </td>

                        {/* Quantity */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                          <span className={isStockIn ? 'text-[#18583d]' : isUndo ? 'text-amber-600' : 'text-red-600'}>
                            {isStockIn ? `+${t.quantity}` : `-${t.quantity}`}
                          </span>
                        </td>

                        {/* Stock Balance Impact */}
                        <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#607269] whitespace-nowrap">
                          <span className="text-[#89988F]">{t.previous_quantity}</span>
                          <span className="mx-1 text-[#89988F]">➔</span>
                          <strong className="text-[#173127] text-xs">{t.new_quantity}</strong>
                        </td>

                        {/* Raw Message */}
                        <td className="py-3.5 px-4 text-[#607269]">
                          <div className="flex items-center gap-1.5 truncate max-w-sm text-xs">
                            {t.source_type === 'voice' ? (
                              <div className="p-1 rounded bg-[#F0F6F2] text-[#18583d] shrink-0" title="Recorded via Voice Note">
                                <Mic className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="p-1 rounded bg-[#F7FAF8] text-[#607269] shrink-0" title="Text message">
                                <MessageSquare className="w-3 h-3" />
                              </div>
                            )}
                            <span className="italic truncate">&ldquo;{t.source_message}&rdquo;</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View (Screens < 768px) */}
            <div className="md:hidden divide-y divide-[#DCE8E0]">
              {filtered.map((t) => {
                const isStockIn = t.type === 'stock_in';
                const isUndo = t.type === 'undo';
                const dateObj = new Date(t.created_at);
                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

                return (
                  <div key={t.id} className="p-4 space-y-2.5 hover:bg-[#F7FAF8] transition-colors">
                    {/* Header Row: Product Name + Quantity */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#173127] text-sm">{t.product_name}</h4>
                        <div className="text-[11px] text-[#89988F] font-mono mt-0.5">
                          {dateStr} at {timeStr}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-base font-extrabold font-mono ${isStockIn ? 'text-[#18583d]' : isUndo ? 'text-amber-600' : 'text-red-600'}`}>
                          {isStockIn ? `+${t.quantity}` : `-${t.quantity}`}
                        </span>
                        <div className="text-[10px] text-[#607269] font-mono">
                          {t.previous_quantity} ➔ <strong className="text-[#173127]">{t.new_quantity}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Operation Badge + Audio/Text source */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        {isUndo ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            <RotateCcw className="w-3 h-3" />
                            Undo
                          </span>
                        ) : isStockIn ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#18583d] bg-[#EBF6F0] border border-[#DCE8E0] px-2.5 py-0.5 rounded-full">
                            <ArrowDownRight className="w-3 h-3 text-[#18583d]" />
                            Stock In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                            <ArrowUpRight className="w-3 h-3 text-red-600" />
                            Stock Out
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#607269] truncate max-w-[200px]">
                        {t.source_type === 'voice' ? (
                          <Mic className="w-3.5 h-3.5 text-[#18583d] shrink-0" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5 text-[#89988F] shrink-0" />
                        )}
                        <span className="italic truncate">&ldquo;{t.source_message}&rdquo;</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
