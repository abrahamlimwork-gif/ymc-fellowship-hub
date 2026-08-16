import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkbook } from '../context/WorkbookContext';
import { PWAInstallBanner } from '../components/PWAInstallBanner';
import { BookCoverCard } from '../components/BookCoverCard';
import { BookOpen, CheckSquare, Sparkles, ArrowRight, ShieldCheck, Heart, User, CheckCircle2, FileText, Share2 } from 'lucide-react';

export function Dashboard({ onSelectWorkbook, onSelectTask, onNavigate }) {
  const { currentUser, isAdmin } = useAuth();
  const { workbooks, questionnaires, getWorkbookProgress, getUserSubmissions } = useWorkbook();

  const userSubs = getUserSubmissions(currentUser?.id);

  return (
    <div className="dashboard-page">
      <PWAInstallBanner />

      {/* Hero Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-card), var(--bg-subtle))',
          borderColor: 'var(--border-color)',
          padding: '1.5rem',
          marginBottom: '1.75rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.65rem' }}>
              <Sparkles size={13} /> Welcome to Fellowship
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Hello, {currentUser?.name || 'Fellowship Member'}!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '580px', margin: 0 }}>
              Never miss a workbook again. All your lessons, interactive questionnaires, and prayer commitments are saved directly to your account.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('journal')}
            >
              <FileText size={14} /> My Notes
            </button>
            {isAdmin && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('admin-builder')}
              >
                <ShieldCheck size={14} /> + New Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section: Assigned Fellowship Tasks */}
      <div style={{ marginBottom: '2.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckSquare size={18} color="var(--primary)" /> Active Fellowship Questionnaires
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Tasks created by leaders for group discussion & alignment
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('tasks')}
          >
            View All ({questionnaires.length})
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {questionnaires.slice(0, 2).map((task) => {
            const isSubmitted = userSubs.some(s => s.taskId === task.id);
            return (
              <div
                key={task.id}
                className="card card-interactive"
                onClick={() => onSelectTask(task)}
                style={{
                  borderLeft: isSubmitted ? '4px solid var(--accent-emerald)' : '4px solid var(--primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 7px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
                      {task.category || 'Fellowship'}
                    </span>
                    {isSubmitted ? (
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={13} /> Submitted
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                        Due: {task.dueDate || 'Open'}
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.35rem', lineHeight: 1.35 }}>
                    {task.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {task.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {task.questions?.length || 0} Questions
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {isSubmitted ? 'Review Answers' : 'Fill Out Form'} <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section: Digital Workbooks Library (3D Book Card Grid) */}
      <div>
        <div style={{ marginBottom: '1.1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={20} color="var(--accent-gold)" /> Interactive Workbooks Library
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Official digitized TWNAF and Young Married Couple materials with interactive write-in lines
          </p>
        </div>

        {/* 3D Book Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {workbooks.map((wb) => {
            const progress = getWorkbookProgress(wb.id);
            return (
              <BookCoverCard
                key={wb.id}
                workbook={wb}
                progress={progress}
                onOpen={() => onSelectWorkbook(wb.id, 1)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
