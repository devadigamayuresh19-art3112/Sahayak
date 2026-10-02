import React from 'react';
import { AlertTriangle, Bell, Check, PackageCheck, Plus, Sparkles } from 'lucide-react';
import { Alert } from '../../types';

interface AlertsPanelProps {
  alerts: Alert[];
  onMarkAsRead: (alertId: string) => void;
  onMarkAllAsRead: () => void;
  onQuickRestock: (productId: string, productName: string, qty: number) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onMarkAsRead,
  onMarkAllAsRead,
  onQuickRestock,
}) => {
  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Low Stock &amp; Inventory Alerts</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-300 text-xs font-mono">
                {unreadCount} unread
              </span>
            )}
          </h3>
          <p className="text-xs text-emerald-200/70">
            Automated alerts triggered when items fall at or below safety buffer levels.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-700/50 text-emerald-300 hover:text-white text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Alerts Grid */}
      {alerts.length === 0 ? (
        <div className="py-20 rounded-3xl glass-panel text-center text-emerald-300/70 border border-emerald-500/20">
          <PackageCheck className="w-12 h-12 mx-auto mb-3 text-[#61b487]" />
          <p className="text-base font-semibold text-white">All Stock Levels Healthy</p>
          <p className="text-xs text-emerald-400/70 mt-1 max-w-sm mx-auto">
            No products are currently below their minimum threshold buffer. Sahayak monitors every stock transaction automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const isOutOfStock = alert.type === 'out_of_stock' || alert.current_stock === 0;

            return (
              <div
                key={alert.id}
                className={`rounded-2xl p-5 border transition-all ${isOutOfStock ? 'bg-red-950/30 border-red-500/40' : 'bg-[#0a2318] border-amber-500/35'} ${!alert.is_read ? 'shadow-lg ring-1 ring-emerald-500/30' : 'opacity-85'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isOutOfStock ? 'bg-red-900/60 text-red-300' : 'bg-amber-900/60 text-amber-300'}`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{alert.product_name}</h4>
                      <span className="text-[11px] font-mono text-emerald-400/80">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {!alert.is_read && (
                    <button
                      onClick={() => onMarkAsRead(alert.id)}
                      title="Mark as read"
                      className="p-1 rounded-md text-emerald-400 hover:text-white hover:bg-emerald-900/50 text-xs flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Acknowledge</span>
                    </button>
                  )}
                </div>

                {/* Stock Stats Row */}
                <div className="my-3.5 p-3 rounded-xl bg-[#05110b] border border-emerald-900/40 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-emerald-500/80 block text-[11px]">Current Balance:</span>
                    <strong className={`font-mono text-sm ${isOutOfStock ? 'text-red-400' : 'text-amber-300'}`}>
                      {alert.current_stock}
                    </strong>
                  </div>
                  <div>
                    <span className="text-emerald-500/80 block text-[11px]">Minimum Buffer:</span>
                    <strong className="font-mono text-sm text-emerald-200">
                      {alert.minimum_stock}
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-emerald-200/80 leading-relaxed mb-4">
                  {alert.message}
                </p>

                {/* Restock Recommendation Action */}
                <div className="pt-3 border-t border-emerald-800/40 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400/90 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#61b487]" />
                    <span>Suggested: Restock 10-20 units</span>
                  </span>

                  <button
                    onClick={() => onQuickRestock(alert.product_id, alert.product_name, 10)}
                    className="px-3 py-1.5 rounded-lg bg-[#61b487] hover:bg-[#78cca0] text-[#05110b] font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-sm hover:scale-102"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Restock +10</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
