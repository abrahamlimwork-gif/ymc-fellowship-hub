import React from 'react';
import { BookOpen, ArrowRight, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function BookCoverCard({ workbook, progress, onOpen, onDelete }) {
  const { isAdmin } = useAuth();
  const isCompleted = progress?.percent === 100;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete workbook "${workbook.title}" from the library?`)) {
      if (onDelete) onDelete(workbook.id);
    }
  };

  return (
    <div
      className="card card-interactive library-grid-card"
      onClick={onOpen}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0.85rem',
        borderRadius: '12px',
        cursor: 'pointer',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        position: 'relative',
        height: '100%'
      }}
    >
      <div>
        {/* Book Cover Container */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '0.65rem',
            padding: '0.6rem 0.25rem',
            background: 'var(--bg-subtle)',
            borderRadius: '8px',
            position: 'relative',
            minHeight: '150px'
          }}
        >
          {workbook.coverImage ? (
            <div
              style={{
                boxShadow: '0 5px 15px rgba(0,0,0,0.25)',
                borderRadius: '5px',
                overflow: 'hidden',
                background: '#ffffff',
                display: 'inline-flex',
                maxHeight: '155px'
              }}
            >
              <img
                src={workbook.coverImage}
                alt={workbook.title}
                style={{
                  width: '105px',
                  height: '150px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          ) : (
            /* Custom Dynamic Workbook Cover */
            <div
              style={{
                width: '105px',
                height: '150px',
                borderRadius: '5px',
                background: workbook.coverColor
                  ? `linear-gradient(135deg, ${workbook.coverColor}, #0f172a)`
                  : 'linear-gradient(135deg, #059669, #047857)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.25)'
              }}
            >
              <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.4px', textTransform: 'uppercase', opacity: 0.85 }}>
                {workbook.badge?.slice(0, 12) || 'Workbook'}
              </span>
              <div>
                <Sparkles size={18} style={{ margin: '0 auto 3px', color: '#fbbf24' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, display: 'block', lineHeight: 1.15 }}>
                  {workbook.title}
                </span>
              </div>
              <span style={{ fontSize: '0.58rem', opacity: 0.85 }}>
                {workbook.totalPages || 1} pgs
              </span>
            </div>
          )}

          {/* Top-Right Completed or Admin Delete Badge */}
          <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            {isCompleted && (
              <span
                style={{
                  background: 'var(--accent-emerald)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px',
                  display: 'inline-flex'
                }}
                title="Completed"
              >
                <CheckCircle2 size={12} />
              </span>
            )}

            {isAdmin && (
              <button
                type="button"
                className="btn-icon btn-sm"
                onClick={handleDelete}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--accent-ruby)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '3px',
                  borderRadius: 'var(--radius-full)'
                }}
                title="Delete Workbook (Admin)"
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>
        </div>

        {/* Title & Page Info */}
        <h4
          style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            marginBottom: '0.2rem',
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.3rem'
          }}
        >
          {workbook.title}
        </h4>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>{workbook.totalPages} Pages</span>
          {workbook.badge && (
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
              {workbook.badge.split('/')[0].trim()}
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        style={{
          width: '100%',
          justifyContent: 'center',
          gap: '4px',
          fontSize: '0.82rem',
          fontWeight: 700,
          padding: '0.4rem 0.6rem',
          borderRadius: '6px'
        }}
      >
        Open <ArrowRight size={13} />
      </button>
    </div>
  );
}
