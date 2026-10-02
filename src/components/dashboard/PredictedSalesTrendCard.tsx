import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, Compass } from 'lucide-react';
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
    <div className="rounded-2xl bg-white p-6 sm:p-7 border border-[#DCE8E0] shadow-sm relative overflow-hidden text-[#173127]">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F0F6F2] border border-[#DCE8E0] flex items-center justify-center text-[#18583d]">
            <Sparkles className="w-4 h-4 text-[#18583d]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#173127] tracking-tight flex items-center gap-2 font-heading">
              <span>Predicted Sales Trend</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F0F6F2] border border-[#DCE8E0] text-[#18583d] font-semibold">
                Linear Regression
              </span>
            </h3>
            <p className="text-xs text-[#607269]">
              Ordinary Least Squares (OLS) model trained on your rolling 7-day sales records
            </p>
          </div>
        </div>

        {/* Trend Indicator Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {isUp ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#EBF6F0] border border-[#DCE8E0] text-[#18583d] text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-[#18583d]" />
              <span>+{forecast.percentageChange}% Expected Growth</span>
            </div>
          ) : isDown ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              <span>{forecast.percentageChange}% Expected Dip</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#F0F6F2] border border-[#DCE8E0] text-[#173127] text-xs font-semibold">
              <Minus className="w-3.5 h-3.5 text-[#607269]" />
              <span>Steady Demand (~{forecast.averageDailySales} units/day)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Metric & Mini Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Big Forecast Number */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs uppercase font-medium tracking-wider text-[#607269] block">
            Tomorrow&apos;s Projected Demand
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-[#173127] font-mono tracking-tight">
              ~{forecast.predictedTomorrow}
            </span>
            <span className="text-sm font-semibold text-[#18583d]">units</span>
          </div>

          {/* Micro Stats Line */}
          <div className="pt-1 flex items-center gap-2 text-xs text-[#607269]">
            <span>Velocity:</span>
            <strong className={`font-mono ${forecast.slope >= 0 ? 'text-[#18583d]' : 'text-red-600'}`}>
              {forecast.slope >= 0 ? `+${forecast.slope}` : forecast.slope} units/day
            </strong>
            <span aria-hidden="true">·</span>
            <span>Fit (R²):</span>
            <strong className="font-mono text-[#173127]">{forecast.rSquared}</strong>
          </div>
        </div>

        {/* Right Column: Regression Trend Visualization */}
        <div className="lg:col-span-7 rounded-xl bg-[#F7FAF8] border border-[#DCE8E0] p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-[#607269] mb-1 px-1">
            <span className="font-mono">Past 7 Days ➔ Tomorrow Forecast</span>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#18583d]" /> Actual
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#61b487]" /> Regression Fit
              </span>
            </span>
          </div>

          {/* SVG Chart */}
          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label={`7-day sales regression chart: predicted demand tomorrow is ~${forecast.predictedTomorrow} units with ${forecast.slope >= 0 ? '+' : ''}${forecast.slope} units per day velocity`}
              className="w-full h-24 overflow-visible"
            >
              {/* Subtle Horizontal grid lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="#DCE8E0"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={getY(maxSale * 0.5)}
                x2={chartWidth - paddingX}
                y2={getY(maxSale * 0.5)}
                stroke="#DCE8E0"
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
                      fill={isToday ? '#18583d' : '#DCE8E0'}
                    />
                    {/* Data label on bar top */}
                    <text
                      x={x}
                      y={Math.max(12, y - 4)}
                      fill="#173127"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {p.actualSales}
                    </text>
                    {/* Day label below */}
                    <text
                      x={x}
                      y={chartHeight - 2}
                      fill={isToday ? '#18583d' : '#89988F'}
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
                stroke="#18583d"
                strokeWidth={2}
              />

              {/* Projected Tomorrow Extension Line (Dashed) */}
              <line
                x1={getX(6)}
                y1={getY(forecast.slope * 6 + forecast.intercept)}
                x2={getX(7)}
                y2={trendEndY}
                stroke="#61b487"
                strokeWidth={2}
                strokeDasharray="4 3"
              />

              {/* Tomorrow Projected Point */}
              <circle
                cx={getX(7)}
                cy={trendEndY}
                r={5}
                fill="#18583d"
                stroke="#61b487"
                strokeWidth={2}
              />
              <text
                x={getX(7)}
                y={Math.max(12, trendEndY - 6)}
                fill="#18583d"
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
                fill="#18583d"
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
      <div className="mt-5 pt-4 border-t border-[#DCE8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2 max-w-2xl text-[#173127]">
          <Compass className="w-4 h-4 text-[#18583d] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#173127]">Smart Inventory Guidance: </span>
            <span className="text-[#607269]">{forecast.recommendation}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[#607269] font-mono text-[11px]">
          <span>7-Day Total: <strong className="text-[#173127]">{forecast.totalPast7Days} units</strong></span>
          <span aria-hidden="true">·</span>
          <span>Daily Avg: <strong className="text-[#173127]">{forecast.averageDailySales}</strong></span>
        </div>
      </div>
    </div>
  );
};
