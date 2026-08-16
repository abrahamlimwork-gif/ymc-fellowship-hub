import React from 'react';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export function BookCoverCard({ workbook, progress, onOpen }) {
  return (
    <div
      className="card card-interactive book-shelf-card"
      onClick={onOpen}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
        borderRadius: '12px',
        cursor: 'pointer',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        height: '100%'
      }}
    >
      <div>
        {/* Simple & Clean Cover Preview Container */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0.75rem',
            background: 'var(--bg-subtle)',
            borderRadius: '8px',
            position: 'relative',
            minHeight: '200px'
          }}
        >
          {workbook.coverImage ? (
            <div
              style={{
                boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                borderRadius: '6px',
                overflow: 'hidden',
                background: '#ffffff',
                display: 'inline-flex',
                maxHeight: '210px'
              }}
            >
              <img
                src={workbook.coverImage}
                alt={workbook.title}
                style={{
                  width: '145px',
                  height: '205px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          ) : (
            /* Custom YMC Covenant Track Cover */
            <div
              style={{
                width: '145px',
                height: '205px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem 0.75rem',
                textAlign: 'center',
                boxShadow: '0 6px 18px rgba(0,0,0,0.3)'
              }}
            >
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.85 }}>
                YMC Fellowship
              </span>
              <div>
                <Sparkles size={26} style={{ margin: '0 auto 6px', color: '#fbbf24' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', lineHeight: 1.25 }}>
                  Young Married Couples
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>
                6-Week Track
              </span>
            </div>
          )}

          {/* Category Badge */}
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            {workbook.badge}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.35rem', lineHeight: 1.35 }}>
          {workbook.title}
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.45, minHeight: '38px' }}>
          {workbook.subtitle}
        </p>

        {/* Progress */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {workbook.totalPages} Pages (Full Verbatim)
            </span>
            <span style={{ fontWeight: 800, color: progress?.percent > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
              {progress?.percent || 0}% Filled
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progress?.percent || 0}%`,
                height: '100%',
                background: (progress?.percent || 0) > 0 ? 'var(--accent-emerald)' : 'var(--primary)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {progress?.answeredFields || 0} of {progress?.totalFields || 0} interactive fields completed
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        type="button"
        className="btn btn-primary"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        style={{ width: '100%', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700 }}
      >
        <BookOpen size={15} /> Open Workbook <ArrowRight size={14} />
      </button>
    </div>
  );
}
