import {
  LayoutDashboard,
  ArrowRightLeft,
  Lightbulb,
  Sun,
  Moon,
  Shield,
  Eye,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 21V5a2 2 0 0 1 2-2h8" />
              <path d="M7 11h6" />
              <path d="M14 21l3-3 3 3" />
              <path d="M17 18v4" />
            </svg>
          </div>
          {!state.isSidebarCollapsed && (
            <div className="sidebar-logo-text">
              Fin<span>Dash</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${state.currentPage === item.id ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
              title={state.isSidebarCollapsed ? item.label : undefined}
            >
              <div className="nav-item-icon-wrapper">
                <item.icon />
              </div>
              {!state.isSidebarCollapsed && <span className="nav-item-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!state.isSidebarCollapsed ? (
            <>
              <span className="role-label">Current Role</span>
              <select
                className="role-selector"
                value={state.role}
                onChange={(e) =>
                  dispatch({ type: 'SET_ROLE', payload: e.target.value })
                }
              >
                <option value="admin">Admin Access</option>
                <option value="viewer">Viewer Mode</option>
              </select>
            </>
          ) : (
            <div className="sidebar-footer-minified">
              {state.role === 'admin' ? <Shield size={18} /> : <Eye size={18} />}
            </div>
          )}
          <button
            className="collapse-btn"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            title={state.isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {state.isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
      </aside>

      <nav className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`bottom-nav-item ${state.currentPage === item.id ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
          >
            <item.icon />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}

export function TopBar() {
  const { state, dispatch } = useApp();

  return (
    <header className="top-bar">
      <div className="mobile-logo" style={{ display: 'none' }}>
         <div className="mobile-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 21V5a2 2 0 0 1 2-2h8" />
              <path d="M7 11h6" />
              <path d="M14 21l3-3 3 3" />
              <path d="M17 18v4" />
            </svg>
         </div>
         <span>Fin<span>Dash</span></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span className={`role-badge ${state.role}`}>
          {state.role === 'admin' ? (
            <Shield size={14} />
          ) : (
            <Eye size={14} />
          )}
          {state.role}
        </span>
        <button
          className="theme-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
        >
          {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
