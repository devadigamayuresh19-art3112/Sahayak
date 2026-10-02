import React from 'react';
import { AlertTriangle, Check, PackageCheck, Plus } from 'lucide-react';
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
          <h3 className="text-lg font-bold text-[#173127] flex items-center gap-2 font-heading">
            <span>Low Stock &amp; Inventory Alerts</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-semibold">
                {unreadCount} unread
              </span>
            )}
          </h3>
          <p className="text-xs text-[#607269]">
            Automated alerts triggered when items fall at or below safety buffer levels.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2 rounded-xl bg-white border border-[#DCE8E0] hover:border-[#18583d] text-[#173127] hover:text-[#18583d] text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Alerts Grid */}
      {alerts.length === 0 ? (
        <div className="py-20 rounded-2xl bg-white text-center text-[#607269] border border-[#DCE8E0] shadow-sm">
          <PackageCheck className="w-12 h-12 mx-auto mb-3 text-[#18583d]" />
          <p className="text-base font-semibold text-[#173127]">All Stock Levels Healthy</p>
          <p className="text-xs text-[#607269] mt-1 max-w-sm mx-auto">
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
                className={`rounded-2xl p-5 border transition-all ${
                  isOutOfStock ? 'bg-[#FFF8F8] border-red-200' : 'bg-[#FFFDF5] border-amber-200'
                } ${!alert.is_read ? 'shadow-md ring-2 ring-[#18583d]/20' : 'opacity-90 shadow-2xs'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#173127]">{alert.product_name}</h4>
                      <span className="text-[11px] font-mono text-[#89988F]">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {!alert.is_read && (
                    <button
                      onClick={() => onMarkAsRead(alert.id)}
                      title="Mark as read"
                      className="p-1 rounded-md text-[#607269] hover:text-[#18583d] hover:bg-white text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Acknowledge</span>
                    </button>
                  )}
                </div>

                {/* Stock Stats Row */}
                <div className="my-3.5 p-3 rounded-xl bg-white border border-[#DCE8E0] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#89988F] block text-[11px]">Current Balance:</span>
                    <strong className={`font-mono text-sm ${isOutOfStock ? 'text-red-600' : 'text-amber-600'}`}>
                      {alert.current_stock}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#89988F] block text-[11px]">Minimum Safe Buffer:</span>
                    <strong className="font-mono text-sm text-[#173127]">
                      {alert.minimum_stock}
                    </strong>
                  </div>
                </div>

                {/* Restock Action Call to Action */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#DCE8E0]">
                  <span className="text-xs text-[#607269]">
                    {isOutOfStock ? 'Urgent: Stock depleted' : 'Attention: Reorder recommended'}
                  </span>
                  <button
                    onClick={() => onQuickRestock(alert.product_id, alert.product_name, 20)}
                    aria-label={`Restock 20 units of ${alert.product_name}`}
                    className="px-3 py-1.5 rounded-xl bg-[#18583d] hover:bg-[#0d3d29] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Restock +20</span>
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
