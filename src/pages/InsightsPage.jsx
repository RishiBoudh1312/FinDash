import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatCurrency,
  getCategoryColor,
  getMonthKey,
} from '../utils/helpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Target,
  PiggyBank,
  Calendar,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Award,
} from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="value" style={{ color: entry.color || entry.fill }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function InsightsPage() {
  const { state } = useApp();

  const insights = useMemo(() => {
    const transactions = state.transactions;
    const expenses = transactions.filter((t) => t.type === 'expense');
    const incomes = transactions.filter((t) => t.type === 'income');

    
    const categoryTotals = {};
    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const sortedCategories = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    );
    const highestCategory = sortedCategories[0] || ['N/A', 0];
    const lowestCategory = sortedCategories[sortedCategories.length - 1] || ['N/A', 0];

    
    const monthlyData = {};
    transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expenses: 0, count: 0 };
      }
      if (t.type === 'income') monthlyData[key].income += t.amount;
      else monthlyData[key].expenses += t.amount;
      monthlyData[key].count++;
    });

    const months = Object.entries(monthlyData).sort(([a], [b]) => a.localeCompare(b));
    const lastMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];

    
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    
    const avgExpense = expenses.length > 0
      ? expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length
      : 0;

    
    const largestExpense = expenses.reduce(
      (max, t) => (t.amount > max.amount ? t : max),
      { amount: 0, description: 'N/A' }
    );
    const largestIncome = incomes.reduce(
      (max, t) => (t.amount > max.amount ? t : max),
      { amount: 0, description: 'N/A' }
    );

    
    const monthlyChartData = months.map(([month, data]) => {
      const d = new Date(month + '-01T00:00:00');
      return {
        month: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        Income: Math.round(data.income),
        Expenses: Math.round(data.expenses),
        Savings: Math.round(data.income - data.expenses),
      };
    });

    
    const radarData = sortedCategories.slice(0, 6).map(([name, value]) => ({
      category: name.length > 12 ? name.substring(0, 12) + '…' : name,
      amount: Math.round(value),
      fullMark: Math.round(sortedCategories[0][1] * 1.2),
    }));

    
    const daySpending = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    expenses.forEach((t) => {
      const day = new Date(t.date + 'T00:00:00').getDay();
      daySpending[day] = (daySpending[day] || 0) + t.amount;
    });
    const dayData = dayNames.map((name, i) => ({
      day: name,
      amount: Math.round(daySpending[i] || 0),
    }));
    const highestSpendingDay = dayData.reduce(
      (max, d) => (d.amount > max.amount ? d : max),
      { day: 'N/A', amount: 0 }
    );

    return {
      highestCategory,
      lowestCategory,
      savingsRate,
      avgExpense,
      largestExpense,
      largestIncome,
      lastMonth,
      prevMonth,
      monthlyChartData,
      radarData,
      dayData,
      highestSpendingDay,
      totalIncome,
      totalExpenses,
    };
  }, [state.transactions]);

  const monthChangeIncome =
    insights.lastMonth && insights.prevMonth
      ? ((insights.lastMonth[1].income - insights.prevMonth[1].income) /
          (insights.prevMonth[1].income || 1)) *
        100
      : 0;

  const monthChangeExpense =
    insights.lastMonth && insights.prevMonth
      ? ((insights.lastMonth[1].expenses - insights.prevMonth[1].expenses) /
          (insights.prevMonth[1].expenses || 1)) *
        100
      : 0;

  return (
    <div className="page-wrapper">
      <div className="page-header animate-fade-in">
        <h1>Insights</h1>
        <p>Understand your spending patterns and financial health.</p>
      </div>

      <div className="insights-grid stagger">

        <div className="insight-card animate-slide-up">
          <div
            className="insight-icon"
            style={{ background: 'var(--danger-subtle)', color: 'var(--danger)' }}
          >
            <AlertTriangle size={22} />
          </div>
          <div className="insight-card-label">Highest Spending Category</div>
          <div className="insight-card-value">
            {insights.highestCategory[0]}
          </div>
          <div className="insight-card-detail">
            {formatCurrency(insights.highestCategory[1])} total spent
          </div>
        </div>

        <div className="insight-card animate-slide-up">
          <div
            className="insight-icon"
            style={{ background: 'var(--success-subtle)', color: 'var(--success)' }}
          >
            <PiggyBank size={22} />
          </div>
          <div className="insight-card-label">Savings Rate</div>
          <div className="insight-card-value">
            {insights.savingsRate.toFixed(1)}%
          </div>
          <div className="insight-card-detail">
            {insights.savingsRate >= 20
              ? '✨ Great! Above recommended 20%'
              : '⚠️ Below the recommended 20%'}
          </div>
        </div>

        <div className="insight-card animate-slide-up">
          <div
            className="insight-icon"
            style={{ background: 'var(--warning-subtle)', color: 'var(--warning)' }}
          >
            <Zap size={22} />
          </div>
          <div className="insight-card-label">Avg. Expense</div>
          <div className="insight-card-value">
            {formatCurrency(insights.avgExpense)}
          </div>
          <div className="insight-card-detail">per transaction</div>
        </div>

        <div className="insight-card animate-slide-up">
          <div
            className="insight-icon"
            style={{ background: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)' }}
          >
            <Target size={22} />
          </div>
          <div className="insight-card-label">Largest Expense</div>
          <div className="insight-card-value">
            {formatCurrency(insights.largestExpense.amount)}
          </div>
          <div className="insight-card-detail">
            {insights.largestExpense.description}
          </div>
        </div>

        <div className="insight-card animate-slide-up">
          <div
            className="insight-icon"
            style={{ background: 'var(--success-subtle)', color: 'var(--success)' }}
          >
            <Award size={22} />
          </div>
          <div className="insight-card-label">Largest Income</div>
          <div className="insight-card-value">
            {formatCurrency(insights.largestIncome.amount)}
          </div>
          <div className="insight-card-detail">
            {insights.largestIncome.description}
          </div>
        </div>

        <div className="insight-card animate-slide-up">
          <div
            className="insight-icon"
            style={{ background: 'var(--info-subtle)', color: 'var(--info)' }}
          >
            <Calendar size={22} />
          </div>
          <div className="insight-card-label">Peak Spending Day</div>
          <div className="insight-card-value">
            {insights.highestSpendingDay.day}
          </div>
          <div className="insight-card-detail">
            {formatCurrency(insights.highestSpendingDay.amount)} total
          </div>
        </div>
      </div>

      <div className="charts-grid stagger">
        <div className="card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Monthly Comparison</h3>
              <p className="card-subtitle">Income vs Expenses by month</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={insights.monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
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
                  cursor={{ fill: 'rgba(255,42,95,0.07)' }}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Bar dataKey="Income" fill="#00ff88" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Expenses" fill="#ff2a5f" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card animate-slide-up">
          <div className="card-header">
            <div>
              <h3 className="card-title">Spending Radar</h3>
              <p className="card-subtitle">Top expense categories</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={insights.radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                  tickFormatter={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`}
                />
                <Radar
                  name="Spending"
                  dataKey="amount"
                  stroke="#ff2a5f"
                  fill="#ff2a5f"
                  fillOpacity={0.25}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {insights.lastMonth && insights.prevMonth && (
        <div className="card animate-slide-up" style={{ marginTop: 24, animationDelay: '200ms' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Month-over-Month Change</h3>
              <p className="card-subtitle">
                {new Date(insights.prevMonth[0] + '-01T00:00:00').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} →{' '}
                {new Date(insights.lastMonth[0] + '-01T00:00:00').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="monthly-comparison-grid">
            <div
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--success-subtle)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUp size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                  Income Change
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  <span style={{ color: monthChangeIncome >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {monthChangeIncome >= 0 ? '+' : ''}
                    {monthChangeIncome.toFixed(1)}%
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {formatCurrency(insights.prevMonth[1].income)} → {formatCurrency(insights.lastMonth[1].income)}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-subtle)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingDown size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                  Expense Change
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  <span style={{ color: monthChangeExpense <= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {monthChangeExpense >= 0 ? '+' : ''}
                    {monthChangeExpense.toFixed(1)}%
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {formatCurrency(insights.prevMonth[1].expenses)} → {formatCurrency(insights.lastMonth[1].expenses)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card animate-slide-up" style={{ marginTop: 24, animationDelay: '300ms' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Spending by Day of Week</h3>
            <p className="card-subtitle">When do you spend the most?</p>
          </div>
        </div>
        <div className="chart-container" style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={insights.dayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border-color)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(140,30,255,0.07)' }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar dataKey="amount" name="Spending" radius={[6, 6, 0, 0]} barSize={36}>
                {insights.dayData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.day === insights.highestSpendingDay.day
                        ? '#ff2a5f'
                        : '#8c1eff'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
