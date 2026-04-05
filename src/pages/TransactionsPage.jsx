import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatCurrency,
  formatDate,
  getCategoryColor,
  exportToCSV,
  exportToJSON,
} from '../utils/helpers';
import { categories } from '../data/transactions';
import TransactionModal from '../components/TransactionModal';
import {
  Search,
  Plus,
  Download,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
  RotateCcw,
  FileText,
  FileJson,
  Inbox,
} from 'lucide-react';

const PAGE_SIZE = 12;
const allCategories = [...new Set([...categories.expense, ...categories.income])];

export default function TransactionsPage() {
  const { state, dispatch, getFilteredTransactions } = useApp();
  const isAdmin = state.role === 'admin';

  const [showModal, setShowModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExport, setShowExport] = useState(false);

  const filtered = useMemo(() => getFilteredTransactions(), [getFilteredTransactions]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasFilters =
    state.filters.search ||
    state.filters.type !== 'all' ||
    state.filters.category !== 'all' ||
    state.filters.dateFrom ||
    state.filters.dateTo;

  const handleSort = (field) => {
    if (state.filters.sortBy === field) {
      dispatch({
        type: 'SET_FILTER',
        payload: {
          key: 'sortOrder',
          value: state.filters.sortOrder === 'asc' ? 'desc' : 'asc',
        },
      });
    } else {
      dispatch({ type: 'SET_FILTER', payload: { key: 'sortBy', value: field } });
      dispatch({ type: 'SET_FILTER', payload: { key: 'sortOrder', value: 'desc' } });
    }
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditTransaction(null);
  };

  const updateFilter = (key, value) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
    setCurrentPage(1);
  };

  const SortIcon = ({ field }) => {
    if (state.filters.sortBy !== field) return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    return (
      <span className="sort-icon" style={{ color: 'var(--accent-primary)', opacity: 1 }}>
        {state.filters.sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="page-header animate-fade-in header-with-actions">
        <div>
          <h1>Transactions</h1>
          <p>{state.transactions.length} total transactions</p>
        </div>
        <div className="header-actions">
          <div className="dropdown-wrapper">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowExport(!showExport)}
            >
              <Download size={16} /> Export
            </button>
            {showExport && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    exportToCSV(filtered);
                    setShowExport(false);
                  }}
                >
                  <FileText size={16} /> Export as CSV
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    exportToJSON(filtered);
                    setShowExport(false);
                  }}
                >
                  <FileJson size={16} /> Export as JSON
                </button>
              </div>
            )}
          </div>

          {isAdmin && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="animate-slide-up" style={{ marginBottom: 24, animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="transaction-filters">
          <div className="filters-row">
            <div className="search-wrapper">
              <Search size={18} />
              <input
                className="filter-input"
                placeholder="Search transactions..."
                value={state.filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
            {hasFilters && (
              <div className="filter-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    dispatch({ type: 'RESET_FILTERS' });
                    setCurrentPage(1);
                  }}
                >
                  <RotateCcw size={16} /> Reset Filters
                </button>
              </div>
            )}
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Transaction Type</label>
              <select
                className="filter-select"
                value={state.filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                className="filter-select"
                value={state.filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group date-range">
              <label>Date Range</label>
              <div className="date-inputs">
                <input
                  className="filter-input"
                  type="date"
                  value={state.filters.dateFrom}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  title="From Date"
                />
                <span className="date-separator">to</span>
                <input
                  className="filter-input"
                  type="date"
                  value={state.filters.dateTo}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                  title="To Date"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card animate-slide-up" style={{ padding: 0, overflow: 'hidden', animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Inbox size={56} />
            <h3>No transactions found</h3>
            <p>
              {hasFilters
                ? 'Try adjusting your filters to see more results.'
                : 'Start by adding your first transaction.'}
            </p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('date')} className={state.filters.sortBy === 'date' ? 'sorted' : ''}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>Date <SortIcon field="date" /></div>
                    </th>
                    <th>Description</th>
                    <th onClick={() => handleSort('category')} className={state.filters.sortBy === 'category' ? 'sorted' : ''}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>Category <SortIcon field="category" /></div>
                    </th>
                    <th>Type</th>
                    <th onClick={() => handleSort('amount')} className={state.filters.sortBy === 'amount' ? 'sorted' : ''}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>Amount <SortIcon field="amount" /></div>
                    </th>
                    {isAdmin && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((t, index) => (
                    <tr key={t.id} style={{ animationDelay: `${(index % PAGE_SIZE) * 50}ms` }} className="animate-slide-up">
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(t.date)}
                      </td>
                      <td style={{ fontWeight: 600 }}>{t.description}</td>
                      <td>
                        <span className="category-tag">
                          <span
                            className="category-dot"
                            style={{ color: getCategoryColor(t.category) }}
                          />
                          {t.category}
                        </span>
                      </td>
                      <td>
                        <span className={`type-badge ${t.type}`}>
                          {t.type === 'income' ? (
                            <ArrowUpRight size={14} />
                          ) : (
                            <ArrowDownRight size={14} />
                          )}
                          {t.type}
                        </span>
                      </td>
                      <td className={`amount-cell ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(t)}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDelete(t.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-pagination">
              <span className="pagination-info">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length}
              </span>
              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <TransactionModal
          transaction={editTransaction}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
