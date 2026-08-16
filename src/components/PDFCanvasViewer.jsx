import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  List,
  Edit3,
  CheckCircle2,
  Printer,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  PenTool,
  Trash2
} from 'lucide-react';
import { useWorkbook } from '../context/WorkbookContext';
import { useAuth } from '../context/AuthContext';

// Set worker to reliable CDN matching pdfjsLib version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;

export function PDFCanvasViewer({
  workbook,
  initialPage = 1,
  onBack
}) {
  const { currentUser } = useAuth();
  const {
    getAnswer,
    saveAnswer,
    getUserPageAnnotations,
    saveUserPageAnnotation,
    deleteUserPageAnnotation
  } = useWorkbook();

  const [pdfDoc, setPdfDoc] = useState(null);
  // currentSheet is 1-indexed sheet in the PDF (1 to totalPages)
  // If initialPage is 1, let's start on the actual book page (e.g. Sheet 3 in MM or Sheet 1)
  const [currentSheet, setCurrentSheet] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(workbook.totalPages || 89);
  const [scale, setScale] = useState(1.3);
  const [isLoading, setIsLoading] = useState(true);
  const [renderError, setRenderError] = useState(null);
  const [isTOCDrawerOpen, setIsTOCDrawerOpen] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(true);
  const [isPenMode, setIsPenMode] = useState(false);
  const [pageInputVal, setPageInputVal] = useState('');

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const renderTaskRef = useRef(null);

  // Find page metadata corresponding to current sheet
  const currentPageData = workbook.pages?.find((p) => p.sheetNum === currentSheet) || {
    sheetNum: currentSheet,
    printedPage: null,
    displayLabel: `Sheet ${currentSheet}`,
    blocks: []
  };

  const displayPageLabel = currentPageData.displayLabel || `Sheet ${currentSheet}`;

  // Load PDF document
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setRenderError(null);

    const loadDoc = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: workbook.pdfUrl,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/cmaps/`,
          cMapPacked: true
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load PDF doc via canvas:', err);
        if (!isCancelled) {
          setRenderError(err.message || 'Failed to load PDF');
          setIsLoading(false);
        }
      }
    };

    if (workbook.pdfUrl) {
      loadDoc();
    }

    return () => {
      isCancelled = true;
    };
  }, [workbook.pdfUrl]);

  // Render current sheet on canvas without any aspect ratio distortion
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore cancel error
        }
      }

      setIsLoading(true);
      const page = await pdfDoc.getPage(currentSheet);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const pixelRatio = window.devicePixelRatio || 1.5;
      const pageRotation = (page.rotate + (currentSheet === 1 ? (workbook.coverRotation || 0) : 0)) % 360;
      const viewport = page.getViewport({ scale: scale, rotation: pageRotation });

      // Set actual pixel buffer dimensions
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);

      // Set exact CSS display dimensions preserving natural aspect ratio
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;
      setIsLoading(false);
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Page render error:', err);
        setIsLoading(false);
      }
    }
  }, [pdfDoc, currentSheet, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  useEffect(() => {
    setPageInputVal(currentPageData.printedPage ? currentPageData.printedPage.toString() : currentSheet.toString());
  }, [currentSheet, currentPageData.printedPage]);

  const handlePrev = () => {
    if (currentSheet > 1) {
      setCurrentSheet((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentSheet < totalPages) {
      setCurrentSheet((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageJump = (e) => {
    e.preventDefault();
    const parsed = parseInt(pageInputVal, 10);
    if (!isNaN(parsed)) {
      // Find sheet by printed page first, then by sheet number
      const foundPage = workbook.pages?.find((p) => p.printedPage === parsed);
      if (foundPage) {
        setCurrentSheet(foundPage.sheetNum);
        setIsTOCDrawerOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Fallback by sheet number
      const clamped = Math.max(1, Math.min(totalPages, parsed));
      setCurrentSheet(clamped);
      setIsTOCDrawerOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Direct Tap on PDF Page to place note
  const handlePageClick = (e) => {
    if (!isPenMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = Math.round((x / rect.width) * 100);
    const yPercent = Math.round((y / rect.height) * 100);

    const newNote = {
      id: 'note_' + Date.now(),
      xPercent: Math.max(5, Math.min(85, xPercent)),
      yPercent: Math.max(5, Math.min(90, yPercent)),
      text: ''
    };

    saveUserPageAnnotation(workbook.id, currentSheet, newNote);
  };

  // Get annotations for this page
  const pageAnnotations = getUserPageAnnotations(workbook.id, currentSheet);

  // Find interactive questions for this exact sheet
  const interactiveBlocks = currentPageData?.blocks?.filter(
    (b) => b.type === 'question_box' || b.type === 'inline_blank_line'
  ) || [];

  return (
    <div className="pdf-canvas-viewer">
      {/* Top Floating Controls Bar */}
      <div
        className="card"
        style={{
          position: 'sticky',
          top: '64px',
          zIndex: 40,
          marginBottom: '1rem',
          padding: '0.65rem 0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow-md)',
          background: 'var(--bg-secondary)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>

        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <button
            className="btn-icon btn-sm"
            onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, minWidth: '42px', textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          <button
            className="btn-icon btn-sm"
            onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <button
            className="btn-icon btn-sm"
            onClick={() => setScale(window.innerWidth < 768 ? 0.95 : 1.3)}
            title="Fit Screen"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${isPenMode ? 'btn-gold' : 'btn-outline'}`}
            onClick={() => setIsPenMode(!isPenMode)}
            title="Click anywhere on the PDF page to write notes / answers"
          >
            <PenTool size={14} /> {isPenMode ? '✍️ Tap PDF (ON)' : '✍️ Write on Page'}
          </button>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => setIsTOCDrawerOpen(!isTOCDrawerOpen)}
          >
            <List size={14} /> Index ({displayPageLabel})
          </button>

          <button
            className={`btn btn-sm ${showNotesDrawer ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            title="Toggle fillable questionnaire box"
          >
            <Edit3 size={14} /> Questions ({interactiveBlocks.length})
          </button>

          <button
            className="btn-icon btn-sm btn-no-print"
            onClick={() => window.print()}
            title="Print Page"
          >
            <Printer size={14} />
          </button>
        </div>
      </div>

      {/* Table of Contents Quick Jump Drawer */}
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
            {workbook.pages?.map((p) => {
              const isCurrent = p.sheetNum === currentSheet;
              return (
                <div
                  key={p.sheetNum}
                  onClick={() => {
                    setCurrentSheet(p.sheetNum);
                    setIsTOCDrawerOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    padding: '0.45rem 0.65rem',
                    background: isCurrent ? 'var(--primary-light)' : 'var(--bg-subtle)',
                    border: '1px solid',
                    borderColor: isCurrent ? 'var(--primary)' : 'var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem' }}>
                      {p.displayLabel}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      Sheet {p.sheetNum}
                    </span>
                  </div>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', color: 'var(--text-secondary)' }}>
                    {p.chapter || p.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pen Mode Helper Hint */}
      {isPenMode && (
        <div
          style={{
            background: 'var(--accent-gold-light)',
            color: 'var(--accent-gold)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>✍️ Write Mode Active: Tap or click anywhere on the book page below to write your notes or answer lines!</span>
          <button className="btn btn-sm btn-outline" onClick={() => setIsPenMode(false)}>Done</button>
        </div>
      )}

      {/* Main Centered Book View Layout */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          width: '100%'
        }}
      >
        {/* Render Error Fallback */}
        {renderError ? (
          <div className="card" style={{ width: '100%', maxWidth: '750px', padding: '0.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <AlertCircle size={16} /> Displaying Original Document via PDF Engine:
            </div>
            <iframe
              src={`${workbook.pdfUrl}#page=${currentSheet}&view=FitH`}
              title="Workbook PDF Page"
              style={{ width: '100%', height: '75vh', border: 'none', borderRadius: '8px' }}
            />
          </div>
        ) : (
          /* Canvas Container (Exact Aspect Ratio, No Distortion) */
          <div
            ref={containerRef}
            onClick={handlePageClick}
            style={{
              background: '#ffffff',
              boxShadow: '0 12px 38px rgba(0,0,0,0.22)',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'inline-block',
              maxWidth: '100%',
              minHeight: '300px',
              position: 'relative',
              cursor: isPenMode ? 'crosshair' : 'default'
            }}
          >
            {isLoading && (
              <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem', display: 'block', color: 'var(--primary)' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Loading sharp {displayPageLabel} (Sheet {currentSheet})...</p>
              </div>
            )}

            <canvas
              ref={canvasRef}
              style={{
                display: isLoading ? 'none' : 'block',
                maxWidth: '100%',
                height: 'auto'
              }}
            />

            {/* Direct Pinned Notes Layer Overlay on the PDF */}
            {!isLoading && pageAnnotations.map((note) => (
              <div
                key={note.id}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  left: `${note.xPercent}%`,
                  top: `${note.yPercent}%`,
                  zIndex: 20,
                  transform: 'translate(-10%, -10%)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1.5px solid var(--primary)',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  padding: '4px',
                  minWidth: '180px',
                  maxWidth: '280px',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px', padding: '0 2px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ✍️ {currentUser?.name}'s Note
                  </span>
                  <button
                    onClick={() => deleteUserPageAnnotation(workbook.id, currentSheet, note.id)}
                    style={{ color: '#ef4444', padding: '1px', border: 'none', background: 'none', cursor: 'pointer' }}
                    title="Delete note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <textarea
                  rows={2}
                  autoFocus={!note.text}
                  placeholder="Type your notes here..."
                  value={note.text || ''}
                  onChange={(e) => saveUserPageAnnotation(workbook.id, currentSheet, { ...note, text: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    lineHeight: 1.4,
                    resize: 'both',
                    outline: 'none'
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Navigation & Flipping Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '680px',
            padding: '0.5rem 0'
          }}
        >
          <button
            className="btn btn-outline"
            disabled={currentSheet === 1}
            onClick={handlePrev}
            style={{ opacity: currentSheet === 1 ? 0.35 : 1 }}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, display: 'block', color: 'var(--text-primary)' }}>
              {displayPageLabel}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              PDF Sheet {currentSheet} of {totalPages}
            </span>
          </div>

          <button
            className="btn btn-primary"
            disabled={currentSheet === totalPages}
            onClick={handleNext}
            style={{ opacity: currentSheet === totalPages ? 0.35 : 1 }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        {/* Fillable Questions & Answers for this exact sheet */}
        {showNotesDrawer && (
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '680px',
              borderLeft: '4px solid var(--primary)',
              padding: '1.5rem',
              background: 'var(--bg-card)',
              boxShadow: 'var(--shadow-md)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Edit3 size={18} color="var(--primary)" /> {displayPageLabel} Interactive Questions ({interactiveBlocks.length})
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Each prompt corresponds to the page above. Saved under {currentUser?.name}'s account.
                </p>
              </div>
              <span className="save-status-badge">
                <CheckCircle2 size={12} /> Auto-Saved
              </span>
            </div>

            {interactiveBlocks.length === 0 ? (
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  📝 Personal Notes & Action Points for {displayPageLabel}:
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder={`Write your personal thoughts, reflections, or notes for ${displayPageLabel}...`}
                  value={getAnswer(workbook.id, `custom_sheet${currentSheet}_notes`)}
                  onChange={(e) => saveAnswer(workbook.id, `custom_sheet${currentSheet}_notes`, e.target.value)}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {interactiveBlocks.map((b, bIdx) => {
                  if (b.type === 'question_box') {
                    const ans = getAnswer(workbook.id, b.id);
                    return (
                      <div key={b.id || bIdx} className="interactive-block" style={{ margin: 0, background: 'var(--bg-subtle)' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '0.45rem', lineHeight: 1.4 }}>
                          {bIdx + 1}. {b.label}
                        </label>
                        <textarea
                          className="form-textarea"
                          rows={b.linesCount || 3}
                          placeholder={b.placeholder || 'Type your answer or reflections here...'}
                          value={ans}
                          onChange={(e) => saveAnswer(workbook.id, b.id, e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {ans ? `✓ ${ans.length} characters (auto-saved)` : 'Type your answer above'}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  if (b.type === 'inline_blank_line') {
                    return (
                      <div key={bIdx} className="interactive-block" style={{ margin: 0, background: 'var(--bg-subtle)' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '0.45rem' }}>
                          ✍️ {b.rawText ? 'Complete the prayer / sentence:' : `Item #${bIdx + 1}:`}
                        </label>
                        <div style={{ fontSize: '0.9rem', lineHeight: 2, color: 'var(--text-primary)' }}>
                          {b.parts?.map((part, pIdx) => {
                            if (part.type === 'text') return <span key={pIdx}>{part.text}</span>;
                            if (part.type === 'inline_input') {
                              const val = getAnswer(workbook.id, part.id);
                              return (
                                <input
                                  key={part.id || pIdx}
                                  type="text"
                                  className="form-input"
                                  style={{
                                    display: 'inline-block',
                                    width: `${Math.max((val.length || part.hint.length || 10) * 11 + 30, 140)}px`,
                                    maxWidth: '100%',
                                    padding: '3px 8px',
                                    margin: '0 4px',
                                    fontSize: '0.88rem',
                                    fontWeight: 700,
                                    background: val ? 'var(--primary-light)' : 'var(--bg-card)',
                                    borderColor: val ? 'var(--primary)' : 'var(--border-color)',
                                    borderBottom: '2px solid var(--primary)',
                                    verticalAlign: 'middle'
                                  }}
                                  placeholder={part.hint ? `(${part.hint})` : '________'}
                                  value={val}
                                  onChange={(e) => saveAnswer(workbook.id, part.id, e.target.value)}
                                />
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
