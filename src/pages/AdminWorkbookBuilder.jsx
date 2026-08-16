import React, { useState } from 'react';
import { useWorkbook } from '../context/WorkbookContext';
import { BookOpen, Plus, Trash2, Save, ArrowLeft, Layers, HelpCircle, FileText, CheckCircle2, Sparkles } from 'lucide-react';

export function AdminWorkbookBuilder({ onBack, onCreated }) {
  const { createWorkbook } = useWorkbook();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('Young Married Couples');
  const [coverColor, setCoverColor] = useState('#059669');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pages, setPages] = useState([
    {
      pageNum: 1,
      title: 'Chapter 1: Foundations of Covenant',
      scriptureRef: 'Genesis 2:24',
      scriptureText: 'Therefore a man shall leave his father and mother and hold fast to his wife, and they shall become one flesh.',
      content: 'True biblical fellowship begins with recognizing that marriage is a holy covenant before God, not merely a social contract.',
      questions: [
        {
          id: 'q1',
          prompt: 'What does leaving and cleaving mean to you in your daily walk?',
          placeholder: 'Write your reflection here...'
        },
        {
          id: 'q2',
          prompt: 'Identify one area where your communication can be strengthened this week:',
          placeholder: 'Write your commitment here...'
        }
      ]
    }
  ]);

  const addPage = () => {
    const nextNum = pages.length + 1;
    setPages([
      ...pages,
      {
        pageNum: nextNum,
        title: `Chapter ${nextNum}: New Lesson`,
        scriptureRef: '',
        scriptureText: '',
        content: '',
        questions: [
          {
            id: `q_${Date.now()}_1`,
            prompt: 'Reflection Question:',
            placeholder: 'Write your answer here...'
          }
        ]
      }
    ]);
  };

  const removePage = (index) => {
    if (pages.length <= 1) return alert('A workbook must have at least one page.');
    const updated = pages.filter((_, idx) => idx !== index).map((p, idx) => ({ ...p, pageNum: idx + 1 }));
    setPages(updated);
  };

  const updatePage = (index, field, value) => {
    const updated = [...pages];
    updated[index][field] = value;
    setPages(updated);
  };

  const addQuestionToPage = (pageIndex) => {
    const updated = [...pages];
    updated[pageIndex].questions.push({
      id: `q_${Date.now()}_${updated[pageIndex].questions.length + 1}`,
      prompt: 'New Question Prompt:',
      placeholder: 'Write your response here...'
    });
    setPages(updated);
  };

  const removeQuestionFromPage = (pageIndex, qIndex) => {
    const updated = [...pages];
    updated[pageIndex].questions = updated[pageIndex].questions.filter((_, idx) => idx !== qIndex);
    setPages(updated);
  };

  const updateQuestion = (pageIndex, qIndex, field, value) => {
    const updated = [...pages];
    updated[pageIndex].questions[qIndex][field] = value;
    setPages(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a workbook title.');

    // Build structured blocks for the pages
    const structuredPages = pages.map((p, idx) => {
      const blocks = [
        { type: 'chapter_header', text: p.title },
        p.subtitle ? { type: 'paragraph', text: p.subtitle } : null,
        p.scriptureText ? { type: 'paragraph', text: `"${p.scriptureText}" — ${p.scriptureRef}` } : null,
        p.content ? { type: 'paragraph', text: p.content } : null,
        ...p.questions.map((q) => ({
          type: 'question_box',
          id: q.id || `custom_q_${idx}_${Date.now()}`,
          label: q.prompt,
          placeholder: q.placeholder || 'Write your reflection here...',
          linesCount: 3
        }))
      ].filter(Boolean);

      return {
        pageNum: idx + 1,
        sheetNum: idx + 1,
        printedPage: idx + 1,
        displayLabel: `Page ${idx + 1}`,
        title: p.title,
        chapter: p.title,
        rawText: `${p.title}\n${p.content}\n${p.questions.map(q => q.prompt).join('\n')}`,
        blocks
      };
    });

    const newWorkbook = {
      id: 'wb-custom-' + Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim() || 'Custom Fellowship Study Material',
      badge: badge.trim(),
      coverColor: coverColor,
      coverImage: null,
      pdfUrl: pdfUrl.trim() || null,
      totalPages: structuredPages.length,
      pages: structuredPages
    };

    createWorkbook(newWorkbook);
    alert(`Workbook "${title}" has been successfully published to the Fellowship Library!`);
    if (onCreated) onCreated();
    else if (onBack) onBack();
  };

  return (
    <div className="admin-builder-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <button className="btn btn-outline btn-sm" onClick={onBack} style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={22} color="var(--primary)" /> Create Fellowship Workbook
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Author new interactive study manuals, prayer guides, and fellowship workbooks.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSave} style={{ gap: '6px' }}>
          <Save size={16} /> Publish Workbook
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Workbook Details Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={18} color="var(--accent-gold)" /> Workbook Metadata & Appearance
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Workbook Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Covenant Living: 4-Week Marriage Guide"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Subtitle / Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Deepening intimacy and biblical leadership in marriage"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Target Audience / Badge</label>
              <select className="form-input" value={badge} onChange={(e) => setBadge(e.target.value)}>
                <option value="Young Married Couples">Young Married Couples</option>
                <option value="Men / Husbands / Mentors">Men / Husbands / Mentors</option>
                <option value="Wives / Mothers">Wives / Mothers</option>
                <option value="Fellowship Leaders">Fellowship Leaders</option>
                <option value="Youth & Singles">Youth & Singles</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Cover Accent Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={coverColor}
                  onChange={(e) => setCoverColor(e.target.value)}
                  style={{ width: '42px', height: '38px', borderRadius: '6px', border: '1px solid var(--border-color)', cursor: 'pointer', padding: '2px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={coverColor}
                  onChange={(e) => setCoverColor(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pages / Lessons Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={18} color="var(--primary)" /> Workbook Chapters & Interactive Pages ({pages.length})
            </h3>
            <button type="button" className="btn btn-outline btn-sm" onClick={addPage} style={{ gap: '4px' }}>
              <Plus size={14} /> Add Chapter / Page
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pages.map((page, pIdx) => (
              <div key={pIdx} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '3px 9px', background: 'var(--primary)', color: '#ffffff', borderRadius: 'var(--radius-full)' }}>
                    Page {page.pageNum}
                  </span>

                  {pages.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon btn-sm"
                      onClick={() => removePage(pIdx)}
                      style={{ color: 'var(--accent-ruby)' }}
                      title="Remove Page"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Chapter / Page Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={page.title}
                      onChange={(e) => updatePage(pIdx, 'title', e.target.value)}
                      placeholder="e.g. Chapter 1: The Principle of Moral Authority"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Scripture Reference</label>
                      <input
                        type="text"
                        className="form-input"
                        value={page.scriptureRef}
                        onChange={(e) => updatePage(pIdx, 'scriptureRef', e.target.value)}
                        placeholder="e.g. Ephesians 5:25"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Scripture Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={page.scriptureText}
                        onChange={(e) => updatePage(pIdx, 'scriptureText', e.target.value)}
                        placeholder="e.g. Husbands, love your wives, as Christ loved the church..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Study Material & Teaching Content</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={page.content}
                      onChange={(e) => updatePage(pIdx, 'content', e.target.value)}
                      placeholder="Write the explanation, devotional lesson, or guidance for this page..."
                    />
                  </div>

                  {/* Interactive Questions */}
                  <div style={{ marginTop: '0.5rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <HelpCircle size={14} color="var(--primary)" /> Fillable Questions & Reflections ({page.questions.length})
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => addQuestionToPage(pIdx)}
                        style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                      >
                        <Plus size={12} /> Add Question
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {page.questions.map((q, qIdx) => (
                        <div key={qIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', width: '20px' }}>
                            #{qIdx + 1}
                          </span>
                          <input
                            type="text"
                            className="form-input"
                            style={{ flex: 2, fontSize: '0.85rem' }}
                            value={q.prompt}
                            onChange={(e) => updateQuestion(pIdx, qIdx, 'prompt', e.target.value)}
                            placeholder="Enter the question or fill-in-the-blank prompt..."
                          />
                          <input
                            type="text"
                            className="form-input"
                            style={{ flex: 1, fontSize: '0.85rem' }}
                            value={q.placeholder}
                            onChange={(e) => updateQuestion(pIdx, qIdx, 'placeholder', e.target.value)}
                            placeholder="Placeholder hint..."
                          />
                          <button
                            type="button"
                            className="btn-icon btn-sm"
                            onClick={() => removeQuestionFromPage(pIdx, qIdx)}
                            style={{ color: 'var(--accent-ruby)', padding: '4px' }}
                            title="Remove Question"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
            <Save size={16} /> Publish Workbook to Library
          </button>
        </div>
      </form>
    </div>
  );
}
