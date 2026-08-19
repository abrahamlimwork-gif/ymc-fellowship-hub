import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkbook } from '../context/WorkbookContext';
import { Home, BookOpen, CheckSquare, User, ShieldPlus } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange }) {
  const { isAdmin, currentUser } = useAuth();
  const { questionnaires, getUserSubmissions } = useWorkbook();

  const userSubs = getUserSubmissions(currentUser?.id);
  const pendingCount = questionnaires.filter(
    (task) => !userSubs.some((s) => s.taskId === task.id)
  ).length;

  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => onTabChange('dashboard')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'workbooks' || activeTab === 'reader' ? 'active' : ''}`}
        onClick={() => onTabChange('workbooks')}
      >
        <BookOpen size={20} />
        <span>Library</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'tasks' || activeTab === 'task-filler' ? 'active' : ''}`}
        onClick={() => onTabChange('tasks')}
        style={{ position: 'relative' }}
      >
        <CheckSquare size={20} />
        <span>Tasks</span>
        {pendingCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '25%',
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '16px',
              height: '16px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }}
          >
            {pendingCount}
          </span>
        )}
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'journal' ? 'active' : ''}`}
        onClick={() => onTabChange('journal')}
      >
        <User size={20} />
        <span>Profile</span>
      </button>

      {isAdmin && (
        <button
          className={`bottom-nav-item ${activeTab === 'admin' || activeTab === 'admin-builder' || activeTab === 'admin-submissions' || activeTab === 'admin-workbook-builder' ? 'active' : ''}`}
          onClick={() => onTabChange('admin')}
        >
          <ShieldPlus size={20} />
          <span>Admin</span>
        </button>
      )}
    </nav>
  );
}
