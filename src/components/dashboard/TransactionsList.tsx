import React, { useState } from 'react';
import { History, Mic, MessageSquare, RotateCcw, Search, SlidersHorizontal, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { InventoryTransaction } from '../../types';

interface TransactionsListProps {
  transactions: InventoryTransaction[];
  onUndoLast: () => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, onUndoLast }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => {
    const matchesSearch =
      t.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source_message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar with Filters and Undo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500/60">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions by product or raw text..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#061810] border border-emerald-700/40 text-white placeholder-emerald-700/60 text-xs focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Action Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#061810] border border-emerald-700/40 text-emerald-200 text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="ALL" className="bg-[#081a13] text-white">All Actions</option>
            <option value="stock_in" className="bg-[#081a13] text-white">Stock In (Added)</option>
            <option value="stock_out" className="bg-[#081a13] text-white">Stock Out (Sold)</option>
            <option value="adjustment" className="bg-[#081a13] text-white">Adjustment</option>
            <option value="undo" className="bg-[#081a13] text-white">Undo Reversals</option>
          </select>

          {/* Undo Button */}
          <button
            onClick={onUndoLast}
            title="Reverses the most recent inventory modification"
            className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-600/50 hover:border-emerald-400 text-emerald-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Undo Last Action</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl glass-panel border border-emerald-500/25 overflow-hidden shadow-2xl">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-emerald-300/70">
            <History className="w-10 h-10 mx-auto mb-3 text-emerald-500/40" />
            <p className="text-sm font-semibold">No transactions recorded yet.</p>
            <p className="text-xs text-emerald-400/60 mt-1">Send a message in the assistant to record stock.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#081f15] border-b border-emerald-800/40 text-emerald-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-mono">Timestamp</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Operation</th>
                  <th className="py-3.5 px-4 text-right">Quantity</th>
                  <th className="py-3.5 px-4 text-right">Stock Impact</th>
                  <th className="py-3.5 px-4">Raw Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30">
                {filtered.map((t) => {
                  const isStockIn = t.type === 'stock_in';
                  const isUndo = t.type === 'undo';
                  const dateStr = new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={t.id} className="hover:bg-emerald-950/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-emerald-400/80 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {t.product_name}
                      </td>
                      <td className="py-3 px-4">
                        {isUndo ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            <RotateCcw className="w-3 h-3" />
                            Undo Reversal
                          </span>
                        ) : isStockIn ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <ArrowDownRight className="w-3 h-3 text-[#61b487]" />
                            Stock In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-300 bg-red-950/70 border border-red-500/30 px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="w-3 h-3 text-red-400" />
                            Stock Out
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                        <span className={isStockIn ? 'text-[#61b487]' : isUndo ? 'text-amber-400' : 'text-red-400'}>
                          {isStockIn ? `+${t.quantity}` : `-${t.quantity}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[11px] text-emerald-400/70 whitespace-nowrap">
                        {t.previous_quantity} → <strong className="text-white">{t.new_quantity}</strong>
                      </td>
                      <td className="py-3 px-4 text-emerald-300/80">
                        <div className="flex items-center gap-1.5 truncate max-w-xs text-xs">
                          {t.source_type === 'voice' ? (
                            <Mic className="w-3 h-3 text-emerald-400 shrink-0" />
                          ) : (
                            <MessageSquare className="w-3 h-3 text-emerald-500 shrink-0" />
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
        )}
      </div>
    </div>
  );
};
