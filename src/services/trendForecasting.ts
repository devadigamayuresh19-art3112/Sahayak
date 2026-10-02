import { InventoryTransaction } from '../types';

export interface DailySalesDataPoint {
  dayIndex: number; // 0 to 6
  dateLabel: string; // e.g. "Mon", "Tue"
  fullDate: string; // YYYY-MM-DD
  actualSales: number; // total units sold (stock_out)
  trendLineValue: number; // fitted y = mx + c
  isToday: boolean;
}

export interface TrendForecastResult {
  dailyPoints: DailySalesDataPoint[];
  predictedTomorrow: number;
  slope: number;
  intercept: number;
  direction: 'up' | 'down' | 'stable';
  percentageChange: number;
  rSquared: number;
  totalPast7Days: number;
  averageDailySales: number;
  summaryText: string;
  recommendation: string;
}

/**
 * Calculates a 7-day linear regression model on inventory sales (stock_out)
 * to predict sales demand for the upcoming day.
 */
export function calculatePredictedSalesTrend(transactions: InventoryTransaction[]): TrendForecastResult {
  const daysCount = 7;
  const now = new Date();
  
  // Build continuous 7-day array [6 days ago, ..., today]
  const dailyBuckets: { date: Date; dateLabel: string; fullDate: string; actualSales: number }[] = [];
  
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = d.toISOString().split('T')[0];

    dailyBuckets.push({
      date: d,
      dateLabel: i === 0 ? 'Today' : dateLabel,
      fullDate,
      actualSales: 0,
    });
  }

  // Aggregate stock_out quantities per day
  transactions.forEach((tx) => {
    if (tx.type === 'stock_out') {
      const txDate = new Date(tx.created_at);
      txDate.setHours(0, 0, 0, 0);
      const txDateStr = txDate.toISOString().split('T')[0];

      const bucket = dailyBuckets.find((b) => b.fullDate === txDateStr);
      if (bucket) {
        bucket.actualSales += tx.quantity;
      }
    }
  });

  const n = daysCount;
  const xValues = [0, 1, 2, 3, 4, 5, 6];
  const yValues = dailyBuckets.map((b) => b.actualSales);

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - meanX;
    const yDiff = yValues[i] - meanY;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;

  // Calculate R-squared (Coefficient of Determination)
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const yFitted = slope * xValues[i] + intercept;
    ssTot += Math.pow(yValues[i] - meanY, 2);
    ssRes += Math.pow(yValues[i] - yFitted, 2);
  }

  const rSquared = ssTot > 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 1;

  // Fit trendline values for the 7 days
  const dailyPoints: DailySalesDataPoint[] = dailyBuckets.map((b, i) => {
    const fitted = Math.max(0, Number((slope * i + intercept).toFixed(1)));
    return {
      dayIndex: i,
      dateLabel: b.dateLabel,
      fullDate: b.fullDate,
      actualSales: b.actualSales,
      trendLineValue: fitted,
      isToday: i === daysCount - 1,
    };
  });

  // Tomorrow is index 7
  const predictedTomorrowRaw = slope * 7 + intercept;
  const predictedTomorrow = Math.max(0, Math.round(predictedTomorrowRaw));

  // Determine trend direction and percentage change
  let direction: 'up' | 'down' | 'stable' = 'stable';
  if (slope > 0.4) direction = 'up';
  else if (slope < -0.4) direction = 'down';

  const baseline = meanY > 0 ? meanY : 1;
  const percentageChange = Number((((predictedTomorrow - meanY) / baseline) * 100).toFixed(1));

  const totalPast7Days = sumY;
  const averageDailySales = Number(meanY.toFixed(1));

  // Generate actionable Kirana summary & recommendation
  let summaryText = '';
  let recommendation = '';

  if (totalPast7Days === 0) {
    summaryText = 'No sales recorded in the past 7 days. Once you record stock-out entries, regression analytics will predict upcoming demand.';
    recommendation = 'Record customer sales using voice or text in the assistant above.';
  } else if (direction === 'up') {
    summaryText = `Sales demand is accelerating by approximately +${Math.abs(slope).toFixed(1)} units/day over the past 7 days.`;
    recommendation = `Tomorrow's predicted demand is ~${predictedTomorrow} units. Ensure high-moving goods (Maggi, Pepsi, Parle-G) are stocked above minimum buffer levels.`;
  } else if (direction === 'down') {
    summaryText = `Daily sales turnover has cooled down by -${Math.abs(slope).toFixed(1)} units/day over the 7-day period.`;
    recommendation = `Predicted volume for tomorrow is ~${predictedTomorrow} units. Moderate incoming purchase orders to avoid over-stocking.`;
  } else {
    summaryText = `Daily sales demand has remained remarkably steady at an average of ${averageDailySales} units/day.`;
    recommendation = `Forecast expects ~${predictedTomorrow} units tomorrow. Maintain standard reorder schedules.`;
  }

  return {
    dailyPoints,
    predictedTomorrow,
    slope: Number(slope.toFixed(2)),
    intercept: Number(intercept.toFixed(2)),
    direction,
    percentageChange,
    rSquared: Number(rSquared.toFixed(2)),
    totalPast7Days,
    averageDailySales,
    summaryText,
    recommendation,
  };
}
