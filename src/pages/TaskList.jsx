import React, { useState } from 'react';
import { useWorkbook } from '../context/WorkbookContext';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Plus, CheckCircle2, Clock, Calendar, ArrowRight, Trash2 } from 'lucide-react';

export function TaskList({ onSelectTask, onNavigate }) {
  const { questionnaires, deleteQuestionnaire, getUserSubmissions } = useWorkbook();
  const { currentUser, isAdmin } = useAuth();
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  const userSubs = getUserSubmissions(currentUser?.id);

  const filteredTasks = questionnaires.filter((task) => {
    const isSubmitted = userSubs.some((s) => s.taskId === task.id);
    if (filter === 'pending') return !isSubmitted;
    if (filter === 'completed') return isSubmitted;
    return true;
  });

  const handleDeleteTask = (e, taskId, title) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete questionnaire "${title}"?`)) {
      deleteQuestionnaire(taskId);
    }
  };

  return (
    <div className="task-list-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={22} color="var(--primary)" /> Fellowship Tasks & Questionnaires
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Fill out custom forms and weekly fellowship check-ins assigned by leaders.
          </p>
        </div>

        {isAdmin && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate('admin-builder')}
          >
            <Plus size={15} /> Create Questionnaire
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >
          All Tasks ({questionnaires.length})
        </button>
        <button
          className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('pending')}
        >
          To Do ({questionnaires.length - userSubs.length > 0 ? questionnaires.length - userSubs.length : 0})
        </button>
        <button
          className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({userSubs.length})
        </button>
      </div>

      {/* Task Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              No questionnaires match the selected filter.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const submission = userSubs.find((s) => s.taskId === task.id);
            const isSubmitted = !!submission;

            return (
              <div
                key={task.id}
                className="card card-interactive"
                onClick={() => onSelectTask(task)}
                style={{
                  borderLeft: isSubmitted ? '4px solid var(--accent-emerald)' : '4px solid var(--primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 7px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
                        {task.category || 'Fellowship Task'}
                      </span>
                      {task.dueDate && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={11} /> Due: {task.dueDate}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{task.title}</h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isSubmitted ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', background: 'var(--accent-emerald-light)', padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>
                        <CheckCircle2 size={13} /> Submitted
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', background: 'var(--accent-gold-light)', padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>
                        <Clock size={13} /> Pending
                      </span>
                    )}

                    {isAdmin && (
                      <button
                        className="btn-icon btn-sm"
                        onClick={(e) => handleDeleteTask(e, task.id, task.title)}
                        style={{ color: 'var(--accent-ruby)', padding: '4px' }}
                        title="Delete Questionnaire (Admin)"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {task.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {task.questions?.length || 0} Questions • Created by {task.createdBy || 'Leader'}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {isSubmitted ? 'Review / Edit Submission' : 'Start Questionnaire'} <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
