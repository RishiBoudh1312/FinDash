import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export default function SummaryCards() {
  const { getSummary, state } = useApp();
  const summary = getSummary();

  const months = new Set(state.transactions.map((t) => t.date.substring(0, 7)));
  const monthCount = months.size || 1;

  const cards = [
    {
      label: 'Total Balance',
      value: formatCurrency(summary.totalBalance),
      icon: Wallet,
      type: 'balance',
      change: summary.totalBalance >= 0 ? '+' : '',
      changeType: summary.totalBalance >= 0 ? 'positive' : 'negative',
      changeText: `Net across ${monthCount} months`,
    },
    {
      label: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      icon: TrendingUp,
      type: 'income',
      change: '+',
      changeType: 'positive',
      changeText: `~${formatCurrency(summary.totalIncome / monthCount)}/mo`,
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: TrendingDown,
      type: 'expense',
      change: '',
      changeType: 'negative',
      changeText: `~${formatCurrency(summary.totalExpenses / monthCount)}/mo`,
    },
    {
      label: 'Transactions',
      value: summary.transactionCount.toLocaleString(),
      icon: Activity,
      type: 'count',
      change: '',
      changeType: 'positive',
      changeText: `~${Math.round(summary.transactionCount / monthCount)}/mo`,
    },
  ];

  return (
    <div className="summary-grid stagger">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`card animate-slide-up`}
        >
          <div className={`summary-card-icon ${card.type}`}>
            <card.icon size={28} />
          </div>
          <div className="summary-card-label">{card.label}</div>
          <div className="summary-card-value">{card.value}</div>
          <span className={`summary-card-change ${card.changeType}`}>
            {card.changeText}
          </span>
        </div>
      ))}
    </div>
  );
}
