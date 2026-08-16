import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Bookmark } from 'lucide-react';

export function InteractiveField({
  section,
  value,
  onChange,
  userName
}) {
  const [localVal, setLocalVal] = useState(value || '');

  useEffect(() => {
    setLocalVal(value || '');
  }, [value]);

  const handleBlur = () => {
    if (localVal !== value) {
      onChange(localVal);
    }
  };

  const handleChange = (newVal) => {
    setLocalVal(newVal);
    onChange(newVal);
  };

  if (section.fieldType === 'prayer-insert') {
    // Dynamic prayer insertion
    const defaultName = localVal || '';
    const renderedPrayer = section.template.replace(/\{NAME\}/g, defaultName.trim() || '__________');

    return (
      <div className="interactive-block">
        <div className="interactive-label">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#d97706" />
            {section.label}
          </span>
          <span className="interactive-tag">{section.tag || 'Prayer'}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          {section.prompt}
        </p>

        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Enter Name to Pray Over:
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. My Husband's / Wife's Name"
            value={localVal}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>

        <div className="scripture-box" style={{ marginTop: '0.5rem', background: 'var(--bg-card)', borderLeft: '4px solid var(--accent-gold)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
            Personalized Daily Prayer:
          </span>
          <p style={{ margin: 0, fontStyle: 'normal', fontWeight: 500, lineHeight: 1.6 }}>
            "{renderedPrayer}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="interactive-block">
      <div className="interactive-label">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bookmark size={16} color="#3b82f6" />
          {section.label}
        </span>
        <span className="interactive-tag" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          {section.tag || 'Worksheet'}
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 500 }}>
        {section.prompt}
      </p>

      {section.fieldType === 'text' ? (
        <input
          type="text"
          className="form-input"
          placeholder={section.placeholder || 'Type your response...'}
          value={localVal}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <textarea
          className="form-textarea"
          rows={4}
          placeholder={section.placeholder || 'Write your reflections, notes, or fellowship answers here...'}
          value={localVal}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {localVal ? `✓ ${localVal.length} characters (auto-saved)` : 'Answers are saved strictly to your account'}
        </span>
        {localVal && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
            <CheckCircle2 size={13} /> Completed
          </span>
        )}
      </div>
    </div>
  );
}
