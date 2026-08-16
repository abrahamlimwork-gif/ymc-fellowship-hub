import React, { useState, useEffect } from 'react';
import { useWorkbook } from '../context/WorkbookContext';
import { useAuth } from '../context/AuthContext';
import { PDFCanvasViewer } from '../components/PDFCanvasViewer';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
  Printer,
  Sparkles,
  ArrowLeft,
  Search,
  CheckCircle2,
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';

export function WorkbookReader({
  initialWorkbookId = 'master-mentor',
  initialPageNum = 1,
  onBack
}) {
  const { currentUser } = useAuth();
  const { workbooks, getAnswer, saveAnswer, getWorkbookProgress } = useWorkbook();

  const [selectedWbId, setSelectedWbId] = useState(initialWorkbookId);
  const [currentPageNum, setCurrentPageNum] = useState(initialPageNum);
  const [isTOCDrawerOpen, setIsTOCDrawerOpen] = useState(false);
  // Default to 'book' mode for exact PDF graphics, images, and layout!
  const [viewMode, setViewMode] = useState('book'); // 'book' | 'digital' | 'pdf'
  const [pageInputVal, setPageInputVal] = useState(initialPageNum);

  const currentWb = workbooks.find((w) => w.id === selectedWbId) || workbooks[0];
  const totalPages = currentWb.totalPages || currentWb.pages?.length || 1;

  useEffect(() => {
    setPageInputVal(currentPageNum);
  }, [currentPageNum]);

  // If in 'book' mode and PDF exists, use PDFCanvasViewer directly
  if (viewMode === 'book' && currentWb.pdfUrl) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <select
              className="form-input"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem', fontWeight: 800, width: 'auto' }}
              value={selectedWbId}
              onChange={(e) => {
                setSelectedWbId(e.target.value);
                setCurrentPageNum(1);
              }}
            >
              {workbooks.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title} ({w.totalPages} pages)
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button
                className={`btn btn-sm ${viewMode === 'book' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 0, padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => setViewMode('book')}
                title="Exact physical book with all images and fillable lines"
              >
                📖 Actual Book + Fillable
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'digital' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 0, padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => setViewMode('digital')}
                title="Digital text view"
              >
                📱 Text Flow
              </button>
            </div>
          </div>
        </div>

        <PDFCanvasViewer
          key={`${selectedWbId}-${currentPageNum}`}
          workbook={currentWb}
          initialPage={currentPageNum}
          onBack={onBack}
        />
      </div>
    );
  }

  // Find page object
  const activePage = currentWb.pages?.find((p) => p.pageNum === currentPageNum) || currentWb.pages?.[0] || {
    pageNum: 1,
    title: 'Page 1',
    blocks: []
  };

  const handlePrevPage = () => {
    if (currentPageNum > 1) {
      setCurrentPageNum(currentPageNum - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPageNum < totalPages) {
      setCurrentPageNum(currentPageNum + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageJump = (e) => {
    e.preventDefault();
    const parsed = parseInt(pageInputVal, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPageNum(parsed);
      setIsTOCDrawerOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = getWorkbookProgress(currentWb.id);

  // Extract chapters for table of contents
  const tocChapters = [];
  currentWb.pages?.forEach((p) => {
    if (p.chapter && !tocChapters.some((c) => c.title === p.chapter)) {
      tocChapters.push({
        title: p.chapter,
        pageNum: p.pageNum
      });
    }
  });

  return (
    <div className="workbook-reader-page">
      {/* Top Controls Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>

        {/* Workbook Switcher & Mode Toggle */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="form-input"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem', fontWeight: 700, width: 'auto' }}
            value={selectedWbId}
            onChange={(e) => {
              setSelectedWbId(e.target.value);
              setCurrentPageNum(1);
            }}
          >
            {workbooks.map((w) => (
              <option key={w.id} value={w.id}>
                {w.title} ({w.totalPages} pages)
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          {currentWb.pdfUrl && (
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button
                className={`btn btn-sm ${viewMode === 'book' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 0, padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                onClick={() => setViewMode('book')}
                title="Exact physical book with all images and fillable lines"
              >
                📖 Actual Book + Fillable
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'digital' ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 0, padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                onClick={() => setViewMode('digital')}
                title="Digital text view"
              >
                📱 Text Flow
              </button>
            </div>
          )}

          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsTOCDrawerOpen(!isTOCDrawerOpen)}
          >
            <List size={14} /> Index / Jump
          </button>

          <button
            className="btn-icon btn-sm btn-no-print"
            title="Print Current Page"
            onClick={() => window.print()}
          >
            <Printer size={14} />
          </button>
        </div>
      </div>

      {/* Quick Jump & Table of Contents Drawer */}
      {isTOCDrawerOpen && (
        <div className="card" style={{ marginBottom: '1.25rem', borderColor: 'var(--border-focus)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Workbook Index & Page Jump</h4>
            <form onSubmit={handlePageJump} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jump to Page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                className="form-input"
                style={{ width: '60px', padding: '0.25rem 0.4rem', fontSize: '0.8rem', textAlign: 'center' }}
                value={pageInputVal}
                onChange={(e) => setPageInputVal(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Go
              </button>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.4rem', maxHeight: '250px', overflowY: 'auto' }}>
            {tocChapters.length > 0 ? (
              tocChapters.map((ch, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentPageNum(ch.pageNum);
                    setIsTOCDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    padding: '0.5rem 0.65rem',
                    background: currentPageNum === ch.pageNum ? 'var(--primary-light)' : 'var(--bg-subtle)',
                    border: '1px solid',
                    borderColor: currentPageNum === ch.pageNum ? 'var(--primary)' : 'var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600
                  }}
                >
                  <span style={{ color: 'var(--primary)', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>
                    Page {ch.pageNum}
                  </span>
                  {ch.title}
                </div>
              ))
            ) : (
              Array.from({ length: Math.min(totalPages, 50) }, (_, i) => i + 1).map((num) => (
                <div
                  key={num}
                  onClick={() => {
                    setCurrentPageNum(num);
                    setIsTOCDrawerOpen(false);
                  }}
                  style={{
                    padding: '0.4rem',
                    textAlign: 'center',
                    background: currentPageNum === num ? 'var(--primary-light)' : 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                >
                  Page {num}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Digital Text Sheet */}
      <div className="workbook-sheet">
        <div className="workbook-header">
          <div>
            <span className="workbook-header-title">{currentWb.title}</span>
            {activePage.chapter && (
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activePage.chapter}
              </p>
            )}
          </div>
          <div className="workbook-page-number">
            PAGE {activePage.pageNum} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {totalPages}</span>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', color: 'var(--text-primary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
          {activePage.blocks?.map((block, bIdx) => {
            if (block.type === 'chapter_header') {
              return (
                <h2
                  key={bIdx}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    marginTop: '1.25rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  {block.text}
                </h2>
              );
            }

            if (block.type === 'activity_badge') {
              return (
                <div key={bIdx} style={{ marginTop: '1.1rem', marginBottom: '0.4rem' }}>
                  <span className="workbook-activity-badge">
                    {block.text}
                  </span>
                </div>
              );
            }

            if (block.type === 'bullet') {
              return (
                <div key={bIdx} style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.45rem', paddingLeft: '0.5rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>•</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{block.text.replace(/^[•o-]\s*/, '')}</span>
                </div>
              );
            }

            if (block.type === 'multiline_blank') {
              const answerVal = getAnswer(currentWb.id, block.id);
              return (
                <div key={block.id || bIdx} className="workbook-write-box">
                  <textarea
                    rows={block.linesCount || 3}
                    className="workbook-line-input"
                    placeholder={block.placeholder || 'Write your notes or fellowship answers here...'}
                    value={answerVal}
                    onChange={(e) => saveAnswer(currentWb.id, block.id, e.target.value)}
                  />
                </div>
              );
            }

            if (block.type === 'inline_blank_line') {
              return (
                <div key={bIdx} style={{ margin: '0.65rem 0', lineHeight: 2 }}>
                  {block.parts?.map((part, pIdx) => {
                    if (part.type === 'text') return <span key={pIdx}>{part.text}</span>;
                    if (part.type === 'inline_input') {
                      const answerVal = getAnswer(currentWb.id, part.id);
                      return (
                        <input
                          key={part.id || pIdx}
                          type="text"
                          className="form-input"
                          style={{
                            display: 'inline-block',
                            width: `${Math.max((answerVal.length || part.hint.length || 10) * 11 + 30, 120)}px`,
                            maxWidth: '100%',
                            padding: '2px 8px',
                            margin: '0 4px',
                            fontSize: '0.92rem',
                            fontWeight: 600,
                            background: answerVal ? 'var(--primary-light)' : 'var(--bg-subtle)',
                            borderColor: answerVal ? 'var(--primary)' : 'var(--border-color)',
                            borderBottom: '2px solid var(--primary)',
                            borderRadius: '4px',
                            color: 'var(--text-primary)',
                            verticalAlign: 'middle'
                          }}
                          placeholder={part.hint ? `(${part.hint})` : '_________'}
                          value={answerVal}
                          onChange={(e) => saveAnswer(currentWb.id, part.id, e.target.value)}
                          title={`Fill in: ${part.hint}`}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              );
            }

            return (
              <p key={bIdx} style={{ marginBottom: '0.65rem', color: 'var(--text-secondary)' }}>
                {block.text}
              </p>
            );
          })}
        </div>

        {/* Bottom Page Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}
        >
          <button
            className="btn btn-outline"
            disabled={currentPageNum === 1}
            onClick={handlePrevPage}
            style={{ opacity: currentPageNum === 1 ? 0.35 : 1 }}
          >
            <ChevronLeft size={16} /> Page {currentPageNum - 1 > 0 ? currentPageNum - 1 : 1}
          </button>

          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Page {currentPageNum} of {totalPages}
          </span>

          <button
            className="btn btn-primary"
            disabled={currentPageNum === totalPages}
            onClick={handleNextPage}
            style={{ opacity: currentPageNum === totalPages ? 0.35 : 1 }}
          >
            Page {currentPageNum + 1 <= totalPages ? currentPageNum + 1 : totalPages} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
