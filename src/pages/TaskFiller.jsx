import React, { useState, useEffect } from 'react';
import { useWorkbook } from '../context/WorkbookContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2, Send, Clock, Calendar, Star, Sparkles } from 'lucide-react';

export function TaskFiller({ task, onBack, onSubmitted }) {
  const { currentUser } = useAuth();
  const { submitTask, getUserSubmissions } = useWorkbook();

  const userSubs = getUserSubmissions(currentUser?.id);
  const existingSub = userSubs.find((s) => s.taskId === task.id);

  const [answers, setAnswers] = useState(() => existingSub?.answers || {});
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    if (existingSub?.answers) {
      setAnswers(existingSub.answers);
    }
  }, [existingSub]);

  const handleFieldChange = (qId, val) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTask(task.id, task.title, answers);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      if (onSubmitted) onSubmitted();
    }, 1500);
  };

  return (
    <div className="task-filler-page">
      {/* Header Back Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>
          <ArrowLeft size={15} /> Back to Tasks
        </button>
        {existingSub && (
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} /> Previously Submitted
          </span>
        )}
      </div>

      <div className="card" style={{ padding: '1.75rem' }}>
        {/* Title & Metadata */}
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 7px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)' }}>
              {task.category || 'Fellowship Questionnaire'}
            </span>
            {task.dueDate && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <Calendar size={11} /> Due: {task.dueDate}
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            {task.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            {task.description}
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {task.questions?.map((q, idx) => {
              const currentVal = answers[q.id] || '';

              return (
                <div key={q.id || idx} className="interactive-block" style={{ margin: 0 }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {idx + 1}. {q.label}
                  </label>

                  {q.type === 'rating' ? (
                    <div>
                      <div className="rating-scale">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            type="button"
                            key={num}
                            className={`rating-btn ${currentVal === num ? 'active' : ''}`}
                            onClick={() => handleFieldChange(q.id, num)}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      {q.labels && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <span>{q.labels[0]}</span>
                          {q.labels[1] && <span>{q.labels[1]}</span>}
                          {q.labels[2] && <span>{q.labels[2]}</span>}
                        </div>
                      )}
                    </div>
                  ) : q.type === 'text' ? (
                    <input
                      type="text"
                      className="form-input"
                      placeholder={q.placeholder || 'Type your answer...'}
                      value={currentVal}
                      onChange={(e) => handleFieldChange(q.id, e.target.value)}
                    />
                  ) : q.type === 'prayer' ? (
                    <div>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder={q.placeholder || 'Write your dedicated prayer commitment...'}
                        value={currentVal}
                        onChange={(e) => handleFieldChange(q.id, e.target.value)}
                      />
                    </div>
                  ) : (
                    <textarea
                      className="form-textarea"
                      rows={4}
                      placeholder={q.placeholder || 'Write your thoughtful response here...'}
                      value={currentVal}
                      onChange={(e) => handleFieldChange(q.id, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Submitting as <strong>{currentUser?.name}</strong> ({currentUser?.email})
            </span>

            <button type="submit" className="btn btn-primary">
              {submittedMessage ? (
                <>
                  <CheckCircle2 size={16} /> Submitted Successfully!
                </>
              ) : (
                <>
                  <Send size={16} /> {existingSub ? 'Update Submission' : 'Submit Questionnaire'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
