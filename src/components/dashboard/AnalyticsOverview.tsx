import React from 'react';
import { BarChart3, TrendingDown, TrendingUp, Layers, Package } from 'lucide-react';
import { InventoryTransaction, Product, ShopStats } from '../../types';
import { PredictedSalesTrendCard } from './PredictedSalesTrendCard';

interface AnalyticsOverviewProps {
  stats: ShopStats;
  products: Product[];
  transactions: InventoryTransaction[];
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  stats,
  products,
  transactions,
}) => {
  // Aggregate movement by product
  const productMovement: Record<string, { inQty: number; outQty: number; total: number }> = {};

  transactions.forEach(t => {
    if (!productMovement[t.product_name]) {
      productMovement[t.product_name] = { inQty: 0, outQty: 0, total: 0 };
    }
    if (t.type === 'stock_in') {
      productMovement[t.product_name].inQty += t.quantity;
      productMovement[t.product_name].total += t.quantity;
    } else if (t.type === 'stock_out') {
      productMovement[t.product_name].outQty += t.quantity;
      productMovement[t.product_name].total += t.quantity;
    }
  });

  const topMoving = Object.entries(productMovement)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  products.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + p.quantity;
  });

  const totalCatalogUnits = stats.totalStockUnits || 1;

  return (
    <div className="space-y-6">
      {/* 7-Day Linear Regression Predicted Sales Trend Card */}
      <PredictedSalesTrendCard transactions={transactions} />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-[#DCE8E0] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#607269] font-medium">
            <span>Total Catalog Products</span>
            <Package className="w-4 h-4 text-[#18583d]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#173127] font-mono">
            {stats.totalProducts}
          </div>
          <p className="mt-1 text-[11px] text-[#89988F]">
            {stats.totalStockUnits} total units in shop
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-[#DCE8E0] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#607269] font-medium">
            <span>Stock Inflow Today</span>
            <TrendingUp className="w-4 h-4 text-[#18583d]" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#18583d] font-mono">
            +{stats.stockAddedToday}
          </div>
          <p className="mt-1 text-[11px] text-[#89988F]">
            Supplies and deliveries received
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-[#DCE8E0] shadow-sm">
          <div className="flex items-center justify-between text-xs text-red-600 font-medium">
            <span>Stock Sold Today</span>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-red-600 font-mono">
            -{stats.stockSoldToday}
          </div>
          <p className="mt-1 text-[11px] text-[#89988F]">
            Customer retail purchases recorded
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-[#DCE8E0] shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-700 font-medium">
            <span>Low Stock Attention</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-amber-600 font-mono">
            {stats.lowStockCount}
          </div>
          <p className="mt-1 text-[11px] text-[#89988F]">
            Items under minimum buffer threshold
          </p>
        </div>
      </div>

      {/* Two Column Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Moving Items */}
        <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-[#173127] flex items-center gap-2 font-heading">
              <BarChart3 className="w-4 h-4 text-[#18583d]" />
              <span>Fastest Moving Products</span>
            </h4>
            <span className="text-[11px] text-[#89988F] font-mono">By turnover volume</span>
          </div>

          {topMoving.length === 0 ? (
            <p className="text-xs text-[#89988F] py-8 text-center">No transaction movements recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {topMoving.map(([name, data]) => {
                const maxVal = Math.max(...topMoving.map(m => m[1].total)) || 1;
                const pct = Math.min(100, Math.round((data.total / maxVal) * 100));

                return (
                  <div key={name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#173127] truncate max-w-xs">{name}</span>
                      <span className="font-mono text-[#18583d] font-semibold">
                        {data.total} units ({data.outQty} sold / {data.inQty} in)
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#F0F6F2] overflow-hidden flex">
                      <div
                        className="h-full bg-[#18583d] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Share Distribution */}
        <div className="rounded-2xl bg-white p-6 border border-[#DCE8E0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-[#173127] flex items-center gap-2 font-heading">
              <Layers className="w-4 h-4 text-[#18583d]" />
              <span>Category Stock Distribution</span>
            </h4>
            <span className="text-[11px] text-[#89988F] font-mono">By inventory units</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percentage = Math.round((count / totalCatalogUnits) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#173127] font-medium">{cat}</span>
                    <span className="font-mono text-[#607269]">
                      {count} units ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F0F6F2] overflow-hidden">
                    <div
                      className="h-full bg-[#18583d] rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
