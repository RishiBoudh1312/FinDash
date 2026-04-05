import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { formatCurrency, getMonthKey, getCategoryColor } from '../utils/helpers';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="value" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function BalanceTrendChart() {
  const { state } = useApp();

  const data = useMemo(() => {
    const monthlyData = {};

    state.transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        monthlyData[key].income += t.amount;
      } else {
        monthlyData[key].expenses += t.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => {
        const date = new Date(month + '-01T00:00:00');
        return {
          month: date.toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
          }),
          Income: Math.round(values.income),
          Expenses: Math.round(values.expenses),
          Net: Math.round(values.income - values.expenses),
        };
      });
  }, [state.transactions]);

  return (
    <div className="card animate-slide-up">
      <div className="card-header">
        <div>
          <h3 className="card-title">Balance Trend</h3>
          <p className="card-subtitle">Monthly income vs expenses</p>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#00ff88" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff2a5f" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#ff2a5f" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-color)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-color)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'var(--border-color-hover)', strokeWidth: 1, fill: 'rgba(255,255,255,0.03)' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Area
              type="monotone"
              dataKey="Income"
              stroke="#00ff88"
              strokeWidth={3}
              fill="url(#incomeGrad)"
            />
            <Area
              type="monotone"
              dataKey="Expenses"
              stroke="#ff2a5f"
              strokeWidth={3}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SpendingBreakdownChart() {
  const { state } = useApp();

  const data = useMemo(() => {
    const categoryTotals = {};
    state.transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        color: getCategoryColor(name),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [state.transactions]);

  const totalExpenses = data.reduce((sum, d) => sum + d.value, 0);

  const renderLabel = ({ name, percent }) => {
    if (percent < 0.05) return '';
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="card animate-slide-up">
      <div className="card-header">
        <div>
          <h3 className="card-title">Spending Breakdown</h3>
          <p className="card-subtitle">
            Total: {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={renderLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  stroke="var(--bg-card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="custom-tooltip">
                    <p className="label">{d.name}</p>
                    <p className="value">{formatCurrency(d.value)}</p>
                  </div>
                );
              }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
