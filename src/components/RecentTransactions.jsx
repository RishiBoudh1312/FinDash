import { formatCurrency, formatDate, getCategoryColor } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function RecentTransactions() {
  const { state, dispatch } = useApp();

  const recent = state.transactions.slice(0, 8);

  if (recent.length === 0) {
    return (
      <div className="card animate-slide-up">
        <div className="card-header">
          <h3 className="card-title">Recent Transactions</h3>
        </div>
        <div className="empty-state">
          <p>No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-slide-up">
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Transactions</h3>
          <p className="card-subtitle">Last {recent.length} entries</p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'transactions' })}
        >
          View All →
        </button>
      </div>
      <div className="recent-list">
        {recent.map((t) => (
          <div className="recent-item" key={t.id}>
            <div className="recent-item-left">
              <div
                className="recent-item-icon"
                style={{
                  background:
                    t.type === 'income'
                      ? 'var(--success-subtle)'
                      : 'var(--danger-subtle)',
                  color:
                    t.type === 'income' ? 'var(--success)' : 'var(--danger)',
                }}
              >
                {t.type === 'income' ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
              </div>
              <div className="recent-item-info">
                <h4>{t.description}</h4>
                <p>
                  <span
                    className="category-dot"
                    style={{
                      background: getCategoryColor(t.category),
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      marginRight: 5,
                      verticalAlign: 'middle',
                    }}
                  />
                  {t.category} · {formatDate(t.date)}
                </p>
              </div>
            </div>
            <span className={`recent-item-amount ${t.type}`} style={{
              color: t.type === 'income' ? 'var(--success)' : 'var(--danger)',
            }}>
              {t.type === 'income' ? '+' : '-'}
              {formatCurrency(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
