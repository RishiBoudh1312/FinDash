import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getTransactions } from '../data/transactions';

const AppContext = createContext(null);

const STORAGE_KEY = 'finance_dashboard_state';
const DATA_VERSION = 'finance_dashboard_v2';

// Load initial state from localStorage or use defaults
function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.dataVersion !== DATA_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        return {
          ...parsed,
          transactions: parsed.transactions?.length ? parsed.transactions : getTransactions(),
        };
      }
    }
  } catch {
    // Ignore parse errors
  }

  return {
    dataVersion: DATA_VERSION,
    transactions: getTransactions(),
    role: 'admin', // 'admin' or 'viewer'
    theme: 'light', // 'dark' or 'light'
    filters: {
      search: '',
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      sortOrder: 'desc',
    },
    currentPage: 'dashboard', // 'dashboard', 'transactions', 'insights'
    isSidebarCollapsed: false,
  };
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };

    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value },
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          search: '',
          type: 'all',
          category: 'all',
          dateFrom: '',
          dateTo: '',
          sortBy: 'date',
          sortOrder: 'desc',
        },
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ),
      };

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions
          .map((t) => (t.id === action.payload.id ? action.payload : t))
          .sort((a, b) => new Date(b.date) - new Date(a.date)),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadInitialState);

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Memoized helpers
  const getFilteredTransactions = useCallback(() => {
    let filtered = [...state.transactions];
    const { search, type, category, dateFrom, dateTo, sortBy, sortOrder } = state.filters;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (type !== 'all') {
      filtered = filtered.filter((t) => t.type === type);
    }

    if (category !== 'all') {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (dateFrom) {
      filtered = filtered.filter((t) => t.date >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter((t) => t.date <= dateTo);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortBy === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [state.transactions, state.filters]);

  const getSummary = useCallback(() => {
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      transactionCount: state.transactions.length,
    };
  }, [state.transactions]);

  const value = {
    state,
    dispatch,
    getFilteredTransactions,
    getSummary,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
