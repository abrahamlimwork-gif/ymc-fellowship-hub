import React, { useState } from 'react';
import { useWorkbook } from '../context/WorkbookContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Save, ArrowLeft, Eye, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export function AdminTaskBuilder({ onBack, onCreated }) {
  const { currentUser } = useAuth();
  const { createQuestionnaire } = useWorkbook();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Weekly Fellowship');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 'q_' + Date.now() + '_1',
      type: 'rating',
      label: 'How would you rate your spiritual and communication alignment as a couple this week?',
      min: 1,
      max: 5,
      labels: ['Needs Work', 'Good', 'Thriving']
    },
    {
      id: 'q_' + Date.now() + '_2',
      type: 'textarea',
      label: 'What specific topic or challenge would you like to discuss in our next fellowship meeting?',
      placeholder: 'Share your thoughts...'
    }
  ]);

  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [isSaved, setIsSaved] = useState(false);

  const addQuestion = (type) => {
    const newQ = {
      id: 'q_' + Date.now() + '_' + (questions.length + 1),
      type: type,
      label: type === 'rating' ? 'Rate this area on a scale of 1 to 5:' : type === 'prayer' ? 'Prayer commitment for this week:' : 'New Reflection Question:',
      placeholder: 'Write your answer here...',
      labels: type === 'rating' ? ['Low', 'Medium', 'High'] : undefined
    };
    setQuestions([...questions, newQ]);
  };

  const updateQuestion = (idx, field, value) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a questionnaire title.');
    if (questions.length === 0) return alert('Please add at least one question.');

    const newQuest = {
      title,
      description,
      category,
      dueDate: dueDate || 'Open',
      createdBy: currentUser?.name || 'Admin',
      questions
    };

    createQuestionnaire(newQuest);
    setIsSaved(true);
    setTimeout(() => {
      if (onCreated) onCreated();
    }, 1200);
  };

  return (
    <div className="admin-builder-page">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'editor' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('editor')}
          >
            Form Editor
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'preview' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={14} /> Live Preview
          </button>
        </div>
      </div>

      {activeTab === 'editor' ? (
        <form onSubmit={handleSave}>
          {/* Main Info Card */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={18} color="#fbbf24" /> Create Custom Fellowship Questionnaire
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Questionnaire Title *
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Week 4: Couple Communication & Finances"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Weekly Fellowship">Weekly Fellowship</option>
                  <option value="Couple Alignment">Couple Alignment</option>
                  <option value="Post-Session Debrief">Post-Session Debrief</option>
                  <option value="Special Fellowship Task">Special Fellowship Task</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Instructions / Description for Members
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Give context or instructions on how to answer this worksheet..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Question Builder List */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Questions ({questions.length})</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => addQuestion('textarea')}
                >
                  + Long Reflection
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => addQuestion('rating')}
                >
                  + 1-5 Rating Scale
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => addQuestion('prayer')}
                >
                  + Prayer Box
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => addQuestion('text')}
                >
                  + Short Text
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questions.map((q, idx) => (
                <div key={q.id} className="card" style={{ padding: '1.1rem', background: 'var(--bg-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Question #{idx + 1} ({q.type.toUpperCase()})
                    </span>
                    <button
                      type="button"
                      className="btn-icon btn-sm"
                      style={{ color: 'var(--accent-rose)', border: 'none', background: 'transparent' }}
                      onClick={() => removeQuestion(idx)}
                      title="Delete question"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ marginBottom: '0.65rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                      Question Label / Prompt
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={q.label}
                      onChange={(e) => updateQuestion(idx, 'label', e.target.value)}
                    />
                  </div>

                  {q.type !== 'rating' && (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                        Placeholder Helper Text
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={q.placeholder || ''}
                        onChange={(e) => updateQuestion(idx, 'placeholder', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline" onClick={onBack}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isSaved ? (
                <>
                  <CheckCircle2 size={16} /> Questionnaire Published!
                </>
              ) : (
                <>
                  <Save size={16} /> Publish Questionnaire
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Live Preview Mode */
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 7px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)' }}>
              {category}
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.35rem' }}>
              {title || 'Untitled Questionnaire'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {description || 'No description entered.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.map((q, idx) => (
              <div key={q.id} className="interactive-block">
                <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                  {idx + 1}. {q.label}
                </label>
                {q.type === 'rating' ? (
                  <div className="rating-scale">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" className="rating-btn">
                        {n}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder={q.placeholder}
                    disabled
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
