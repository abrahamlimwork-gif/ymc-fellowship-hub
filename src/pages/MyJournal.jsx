import React, { useState } from 'react';
import { useWorkbook } from '../context/WorkbookContext';
import { useAuth } from '../context/AuthContext';
import { BookMarked, Search, Printer, Calendar, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export function MyJournal({ onSelectWorkbook }) {
  const { currentUser } = useAuth();
  const { workbooks, userAnswers, getUserSubmissions } = useWorkbook();
  const [searchTerm, setSearchTerm] = useState('');

  const userSubs = getUserSubmissions(currentUser?.id);

  // Flatten all interactive answers written by current user across all workbooks
  const journalEntries = [];

  workbooks.forEach((wb) => {
    wb.pages?.forEach((p) => {
      p.elements?.forEach((el) => {
        if (el.type === 'interactive_blank') {
          const val = userAnswers?.[wb.id]?.[el.id]?.value;
          const updatedAt = userAnswers?.[wb.id]?.[el.id]?.updatedAt;
          if (val && val.trim().length > 0) {
            journalEntries.push({
              id: `${wb.id}_${p.pageNum}_${el.id}`,
              workbookId: wb.id,
              workbookTitle: wb.title,
              pageNum: p.pageNum,
              chapter: p.chapter || `Page ${p.pageNum}`,
              label: `Page ${p.pageNum} Notes`,
              prompt: el.prompt,
              content: val,
              updatedAt: updatedAt || new Date().toISOString()
            });
          }
        }
      });
    });
  });

  const filteredEntries = journalEntries.filter((entry) => {
    const term = searchTerm.toLowerCase();
    return (
      entry.content.toLowerCase().includes(term) ||
      (entry.prompt && entry.prompt.toLowerCase().includes(term)) ||
      (entry.chapter && entry.chapter.toLowerCase().includes(term)) ||
      entry.workbookTitle.toLowerCase().includes(term)
    );
  });

  return (
    <div className="my-journal-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookMarked size={22} color="#059669" /> My Personal Journal & Reflections
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            All your saved answers, prayer commitments, and notes in one place.
          </p>
        </div>

        <button className="btn btn-outline btn-sm btn-no-print" onClick={() => window.print()}>
          <Printer size={14} /> Print My Journal
        </button>
      </div>

      {/* Search Bar & Summary Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px' }}
            placeholder="Search your notes and reflections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)' }}>
            {journalEntries.length} Saved Reflections
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)' }}>
            {userSubs.length} Submitted Tasks
          </span>
        </div>
      </div>

      {/* Entries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredEntries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <Sparkles size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              {searchTerm ? 'No matching reflections found' : 'No reflections saved yet'}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
              Start reading and filling out the interactive chapters in your workbooks to build your personal faith journal.
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onSelectWorkbook('master-mentor')}
            >
              Open Workbooks Library
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="card"
              style={{
                borderLeft: '4px solid var(--accent-emerald)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {entry.workbookTitle}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {entry.chapter} (Page {entry.pageNum})
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800 }}>{entry.label}</h4>
                </div>

                <button
                  className="btn btn-outline btn-sm btn-no-print"
                  onClick={() => onSelectWorkbook(entry.workbookId, entry.pageNum)}
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                >
                  Go to Page {entry.pageNum} <ArrowRight size={12} />
                </button>
              </div>

              {entry.prompt && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                  "{entry.prompt}"
                </p>
              )}

              <div
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6
                }}
              >
                {entry.content}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Saved in {currentUser?.name}'s account
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
