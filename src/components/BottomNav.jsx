import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, CheckSquare, BookMarked, ShieldPlus } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange }) {
  const { isAdmin } = useAuth();

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
        <span>Workbooks</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'tasks' || activeTab === 'task-filler' ? 'active' : ''}`}
        onClick={() => onTabChange('tasks')}
      >
        <CheckSquare size={20} />
        <span>Tasks</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'journal' ? 'active' : ''}`}
        onClick={() => onTabChange('journal')}
      >
        <BookMarked size={20} />
        <span>My Journal</span>
      </button>

      {isAdmin && (
        <button
          className={`bottom-nav-item ${activeTab === 'admin' || activeTab === 'admin-builder' || activeTab === 'admin-submissions' ? 'active' : ''}`}
          onClick={() => onTabChange('admin')}
        >
          <ShieldPlus size={20} />
          <span>Admin</span>
        </button>
      )}
    </nav>
  );
}
