import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkbook } from '../context/WorkbookContext';
import { AccountSwitcherModal } from './AccountSwitcherModal';
import { Sun, Moon, Users, Check, Clock, BookOpen, Shield } from 'lucide-react';

export function Navbar({ onNavigate, currentPage }) {
  const { currentUser, theme, toggleTheme, isAdmin } = useAuth();
  const { saveStatus } = useWorkbook();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="brand" onClick={() => onNavigate('dashboard')}>
          <div className="brand-icon">
            <BookOpen size={20} />
          </div>
          <div className="brand-text">
            <h1>
              YMC Hub <span className="brand-badge">TWNAF</span>
            </h1>
            <p>Young Married Couples Fellowship</p>
          </div>
        </div>

        <div className="nav-actions">
          {/* Autosave Status Pill */}
          <div
            className={`save-status-badge ${saveStatus === 'saving' ? 'saving' : ''}`}
            title="All responses are automatically saved per user account"
          >
            {saveStatus === 'saving' ? (
              <>
                <Clock size={12} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check size={12} /> Autosaved
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="btn-icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Active Account Pill & Switcher */}
          <div
            className="account-pill"
            onClick={() => setIsSwitcherOpen(true)}
            title="Switch or manage fellowship account"
          >
            <div
              className="account-avatar"
              style={{ background: isAdmin ? '#1e293b' : 'var(--primary)' }}
            >
              {currentUser?.avatar || currentUser?.name?.slice(0, 2).toUpperCase()}
            </div>
            <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.name?.split(' ')[0]}
            </span>
            {isAdmin && <Shield size={12} color="#fbbf24" />}
          </div>
        </div>
      </header>

      <AccountSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
}
