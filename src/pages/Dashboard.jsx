import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkbook } from '../context/WorkbookContext';
import { PWAInstallBanner } from '../components/PWAInstallBanner';
import { BookCoverCard } from '../components/BookCoverCard';
import { BookOpen, CheckSquare, Sparkles, ArrowRight, ShieldCheck, Plus, CheckCircle2, FileText, ChevronRight, Bookmark } from 'lucide-react';

export function Dashboard({ onSelectWorkbook, onSelectTask, onNavigate }) {
  const { currentUser, isAdmin } = useAuth();
  const { workbooks, questionnaires, getWorkbookProgress, getUserSubmissions, deleteWorkbook } = useWorkbook();

  const [activeCategory, setActiveCategory] = useState('All');

  const userSubs = getUserSubmissions(currentUser?.id);

  // Find the first pending task for the subtle notification strip
  const pendingTask = questionnaires.find(
    (task) => !userSubs.some((s) => s.taskId === task.id)
  );

  // Active / Spotlight Workbook (Master Mentor by default or first available)
  const activeWb = workbooks.find((w) => w.id === 'master-mentor') || workbooks[0];
  const activeProgress = activeWb ? getWorkbookProgress(activeWb.id) : { percent: 0 };

  // Filtered workbooks for the 2-column grid library
  const filteredWorkbooks = workbooks.filter((wb) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Men') return wb.badge?.toLowerCase().includes('men') || wb.badge?.toLowerCase().includes('husband');
    if (activeCategory === 'Women') return wb.badge?.toLowerCase().includes('wive') || wb.badge?.toLowerCase().includes('mother') || wb.badge?.toLowerCase().includes('women');
    if (activeCategory === 'Couples') return wb.badge?.toLowerCase().includes('couple') || wb.badge?.toLowerCase().includes('married');
    return true;
  });

  return (
    <div className="dashboard-page" style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '2rem' }}>
      <PWAInstallBanner />

      {/* 1. Header with User Greeting and Avatar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '0.5rem 0'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Welcome,
          </h2>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {currentUser?.name || 'Fellowship Member'}!
          </h2>
        </div>

        <div
          className="account-avatar-btn"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--primary), #4338ca)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.05rem',
            fontWeight: 800,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '2px solid #ffffff'
          }}
        >
          {currentUser?.avatar || 'FM'}
        </div>
      </div>

      {/* 2. Subtle 1-Line Task Notification Pill (Option E) */}
      {pendingTask && (
        <div
          className="subtle-task-pill"
          onClick={() => onSelectTask(pendingTask)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.6rem 0.9rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <span>📋</span>
            <span>
              1 Pending Fellowship Survey • {pendingTask.title.length > 22 ? pendingTask.title.slice(0, 22) + '...' : pendingTask.title}
            </span>
          </div>
          <ChevronRight size={15} color="var(--text-muted)" />
        </div>
      )}

      {/* 3. "Currently Studying" Spotlight Hero Card (Option E) */}
      {activeWb && (
        <div
          className="card hero-spotlight-card"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            {/* Book Cover */}
            <div
              style={{
                width: '85px',
                height: '118px',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
                background: activeWb.coverColor || '#1e3a8a',
                flexShrink: 0
              }}
            >
              {activeWb.coverImage ? (
                <img
                  src={activeWb.coverImage}
                  alt={activeWb.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <BookOpen size={24} />
                </div>
              )}
            </div>

            {/* Right Meta Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)', display: 'block', marginBottom: '2px' }}>
                Currently Studying
              </span>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1.25 }}>
                {activeWb.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                {activeWb.badge || 'YMC Series'}
              </p>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                  <span style={{ color: 'var(--accent-emerald)' }}>{activeProgress.percent || 0}% Complete</span>
                  <span style={{ color: 'var(--text-muted)' }}>Page 17 (5 questions left)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${activeProgress.percent || 65}%`,
                      height: '100%',
                      background: 'var(--accent-emerald)',
                      borderRadius: 'var(--radius-full)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Solid Green Action Button */}
          <button
            type="button"
            className="btn"
            onClick={() => onSelectWorkbook(activeWb.id, 17)}
            style={{
              width: '100%',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.92rem',
              fontWeight: 800,
              background: '#15803d',
              color: '#ffffff',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)'
            }}
          >
            Continue Reading <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* 4. Fellowship Library Section (Option E) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Fellowship Library
          </h3>

          {isAdmin && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('admin-workbook-builder')}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', gap: '4px' }}
            >
              <Plus size={13} /> + Workbook
            </button>
          )}
        </div>

        {/* Category Filter Pills (Option E) */}
        <div
          className="filter-pills-row"
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.65rem',
            marginBottom: '0.85rem'
          }}
        >
          {['All', 'Men', 'Women', 'Couples'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                background: activeCategory === cat ? 'var(--primary)' : 'var(--bg-card)',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'All' ? 'All (Active)' : cat}
            </button>
          ))}
        </div>

        {/* 2-Column Responsive Book Cards Grid (Option E) */}
        <div
          className="library-2col-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.85rem'
          }}
        >
          {filteredWorkbooks.map((wb) => {
            const progress = getWorkbookProgress(wb.id);
            return (
              <BookCoverCard
                key={wb.id}
                workbook={wb}
                progress={progress}
                onOpen={() => onSelectWorkbook(wb.id, 1)}
                onDelete={deleteWorkbook}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
