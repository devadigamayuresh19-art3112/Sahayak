import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, AlertCircle, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';
import { InventoryTransaction } from '../../types';
import { calculatePredictedSalesTrend, TrendForecastResult } from '../../services/trendForecasting';

interface PredictedSalesTrendCardProps {
  transactions: InventoryTransaction[];
}

export const PredictedSalesTrendCard: React.FC<PredictedSalesTrendCardProps> = ({ transactions }) => {
  const forecast: TrendForecastResult = useMemo(() => {
    return calculatePredictedSalesTrend(transactions);
  }, [transactions]);

  // Chart layout calculations
  const maxSale = Math.max(
    ...forecast.dailyPoints.map((p) => p.actualSales),
    forecast.predictedTomorrow,
    10
  );

  const chartHeight = 90;
  const chartWidth = 340;
  const paddingX = 24;
  const paddingY = 16;
  const usableWidth = chartWidth - paddingX * 2;
  const usableHeight = chartHeight - paddingY * 2;

  // 8 points: indices 0..6 (historical 7 days) and index 7 (tomorrow's prediction)
  const getX = (index: number) => paddingX + (index / 7) * usableWidth;
  const getY = (val: number) => paddingY + usableHeight - (val / (maxSale * 1.15)) * usableHeight;

  // Trendline start (x=0) and end (x=7)
  const trendStartY = getY(forecast.intercept);
  const trendEndY = getY(forecast.slope * 7 + forecast.intercept);

  const isUp = forecast.direction === 'up';
  const isDown = forecast.direction === 'down';

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-emerald-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0a2318] via-[#071d14] to-[#05110b]">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#18583d]/25 rounded-full blur-[80px] pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#18583d] border border-emerald-400/40 flex items-center justify-center text-[#61b487]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Predicted Sales Trend</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/50 text-emerald-400">
                Linear Regression
              </span>
            </h3>
            <p className="text-xs text-emerald-200/70">
              Ordinary Least Squares (OLS) model trained on your rolling 7-day sales records
            </p>
          </div>
        </div>

        {/* Trend Indicator Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {isUp ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-[#61b487]" />
              <span>+{forecast.percentageChange}% Expected Growth</span>
            </div>
          ) : isDown ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-semibold">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              <span>{forecast.percentageChange}% Expected Dip</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#081f15] border border-emerald-700/40 text-emerald-200 text-xs font-semibold">
              <Minus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Steady Demand (~{forecast.averageDailySales} units/day)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Metric & Mini Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Big Forecast Number */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs uppercase font-medium tracking-wider text-emerald-400/80 block">
            Tomorrow&apos;s Projected Demand
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              ~{forecast.predictedTomorrow}
            </span>
            <span className="text-sm font-semibold text-emerald-300">units</span>
          </div>

          {/* Micro Stats Line */}
          <div className="pt-1 flex items-center gap-2 text-xs text-emerald-400/80">
            <span>Velocity:</span>
            <strong className={`font-mono ${forecast.slope >= 0 ? 'text-[#61b487]' : 'text-red-400'}`}>
              {forecast.slope >= 0 ? `+${forecast.slope}` : forecast.slope} units/day
            </strong>
            <span aria-hidden="true">·</span>
            <span>Fit (R²):</span>
            <strong className="font-mono text-emerald-200">{forecast.rSquared}</strong>
          </div>
        </div>

        {/* Right Column: Regression Trend Visualization */}
        <div className="lg:col-span-7 rounded-2xl bg-[#05110b]/80 border border-emerald-800/40 p-3.5">
          <div className="flex items-center justify-between text-[11px] text-emerald-400/80 mb-1 px-1">
            <span className="font-mono">Past 7 Days ➔ Tomorrow Forecast</span>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#61b487]" /> Actual
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#2dd4bf]" /> Regression Fit
              </span>
            </span>
          </div>

          {/* SVG Chart */}
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-24 overflow-visible"
            >
              {/* Subtle Horizontal grid lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="rgba(97, 180, 135, 0.15)"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={getY(maxSale * 0.5)}
                x2={chartWidth - paddingX}
                y2={getY(maxSale * 0.5)}
                stroke="rgba(97, 180, 135, 0.12)"
                strokeDasharray="3 3"
              />

              {/* Historical Bars */}
              {forecast.dailyPoints.map((p) => {
                const x = getX(p.dayIndex);
                const y = getY(p.actualSales);
                const barH = Math.max(2, chartHeight - paddingY - y);
                const isToday = p.isToday;

                return (
                  <g key={p.dayIndex}>
                    {/* Bar */}
                    <rect
                      x={x - 6}
                      y={y}
                      width={12}
                      height={barH}
                      rx={3}
                      fill={isToday ? '#61b487' : 'rgba(97, 180, 135, 0.35)'}
                    />
                    {/* Data label on bar top */}
                    <text
                      x={x}
                      y={Math.max(12, y - 4)}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {p.actualSales}
                    </text>
                    {/* Day label below */}
                    <text
                      x={x}
                      y={chartHeight - 2}
                      fill={isToday ? '#61b487' : '#94a3b8'}
                      fontSize="9"
                      fontWeight={isToday ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      {p.dateLabel}
                    </text>
                  </g>
                );
              })}

              {/* Linear Regression Line */}
              <line
                x1={getX(0)}
                y1={trendStartY}
                x2={getX(6)}
                y2={getY(forecast.slope * 6 + forecast.intercept)}
                stroke="#2dd4bf"
                strokeWidth={2}
              />

              {/* Projected Tomorrow Extension Line (Dashed) */}
              <line
                x1={getX(6)}
                y1={getY(forecast.slope * 6 + forecast.intercept)}
                x2={getX(7)}
                y2={trendEndY}
                stroke="#2dd4bf"
                strokeWidth={2}
                strokeDasharray="4 3"
              />

              {/* Tomorrow Projected Point */}
              <circle
                cx={getX(7)}
                cy={trendEndY}
                r={5}
                fill="#2dd4bf"
                stroke="#05110b"
                strokeWidth={2}
              />
              <text
                x={getX(7)}
                y={Math.max(12, trendEndY - 6)}
                fill="#2dd4bf"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                ~{forecast.predictedTomorrow}
              </text>
              <text
                x={getX(7)}
                y={chartHeight - 2}
                fill="#2dd4bf"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                Tmrw
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Kirana Actionable Recommendation */}
      <div className="mt-5 pt-4 border-t border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2 max-w-2xl text-emerald-100/90">
          <Compass className="w-4 h-4 text-[#61b487] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Smart Inventory Guidance: </span>
            <span className="text-emerald-200/80">{forecast.recommendation}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-emerald-400 font-mono text-[11px]">
          <span>7-Day Total: <strong className="text-white">{forecast.totalPast7Days} units</strong></span>
          <span aria-hidden="true">·</span>
          <span>Daily Avg: <strong className="text-white">{forecast.averageDailySales}</strong></span>
        </div>
      </div>
    </div>
  );
};
