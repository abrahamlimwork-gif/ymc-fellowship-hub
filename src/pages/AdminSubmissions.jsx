import React, { useState } from 'react';
import { useWorkbook } from '../context/WorkbookContext';
import { ShieldCheck, Download, Search, User, Calendar, CheckCircle2, ChevronRight, X, ArrowLeft, Trash2 } from 'lucide-react';

export function AdminSubmissions({ onBack }) {
  const { submissions, questionnaires, deleteSubmission } = useWorkbook();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('all');
  const [viewingSub, setViewingSub] = useState(null);

  const filteredSubs = submissions.filter((s) => {
    const matchSearch = (s.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.taskTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchTask = selectedTaskFilter === 'all' || s.taskId === selectedTaskFilter;
    return matchSearch && matchTask;
  });

  const handleDeleteSubmission = (e, subId, memberName, taskTitle) => {
    e.stopPropagation();
    if (window.confirm(`Delete submission by ${memberName} for "${taskTitle}"?`)) {
      deleteSubmission(subId);
      if (viewingSub?.id === subId) {
        setViewingSub(null);
      }
    }
  };

  const exportCSV = () => {
    if (submissions.length === 0) return alert('No submissions to export.');
    
    let csvContent = 'data:text/csv;charset=utf-8,Member Name,Email,Task Title,Submitted Date,Answers\n';
    submissions.forEach(s => {
      const answersStr = JSON.stringify(s.answers).replace(/"/g, '""');
      csvContent += `"${s.userName}","${s.userEmail}","${s.taskTitle}","${new Date(s.submittedAt).toLocaleDateString()}","${answersStr}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YMC_Fellowship_Submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-submissions-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="#fbbf24" /> Member Task Submissions
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Inspect answers submitted by fellowship members for group tasks & surveys.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>
            <Download size={14} /> Export to CSV
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px' }}
            placeholder="Search by member name or task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '180px' }}
          value={selectedTaskFilter}
          onChange={(e) => setSelectedTaskFilter(e.target.value)}
        >
          <option value="all">All Questionnaires</option>
          {questionnaires.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredSubs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              No submissions found for the selected criteria.
            </p>
          </div>
        ) : (
          filteredSubs.map((sub) => {
            const dateStr = sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently';

            return (
              <div
                key={sub.id}
                className="card card-interactive"
                onClick={() => setViewingSub(sub)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div className="account-avatar" style={{ width: 40, height: 40, fontSize: '0.9rem' }}>
                    {sub.userName?.slice(0, 2).toUpperCase() || 'M'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '2px' }}>
                      {sub.userName}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, display: 'block' }}>
                      {sub.taskTitle}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Submitted {dateStr}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {Object.keys(sub.answers || {}).length} answers
                  </span>
                  <button
                    className="btn-icon btn-sm"
                    onClick={(e) => handleDeleteSubmission(e, sub.id, sub.userName, sub.taskTitle)}
                    style={{ color: 'var(--accent-ruby)', padding: '4px' }}
                    title="Delete Submission (Admin)"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Response Modal */}
      {viewingSub && (
        <div className="modal-overlay" onClick={() => setViewingSub(null)}>
          <div className="modal-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 7px', background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-full)' }}>
                  Member Response
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px' }}>
                  {viewingSub.taskTitle}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  By <strong>{viewingSub.userName}</strong> ({viewingSub.userEmail}) • {new Date(viewingSub.submittedAt).toLocaleString()}
                </p>
              </div>

              <button className="btn-icon" onClick={() => setViewingSub(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {Object.entries(viewingSub.answers || {}).map(([key, val], idx) => (
                <div key={key} className="interactive-block" style={{ margin: 0 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                    Response #{idx + 1}
                  </span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                    {typeof val === 'object' ? JSON.stringify(val) : String(val || 'No answer provided.')}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--accent-ruby)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                onClick={(e) => handleDeleteSubmission(e, viewingSub.id, viewingSub.userName, viewingSub.taskTitle)}
              >
                <Trash2 size={14} /> Delete Submission
              </button>

              <button className="btn btn-primary btn-sm" onClick={() => setViewingSub(null)}>
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
