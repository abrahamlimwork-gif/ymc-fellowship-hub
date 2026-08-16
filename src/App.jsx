import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkbookProvider } from './context/WorkbookContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { WorkbookReader } from './pages/WorkbookReader';
import { TaskList } from './pages/TaskList';
import { TaskFiller } from './pages/TaskFiller';
import { AdminTaskBuilder } from './pages/AdminTaskBuilder';
import { AdminSubmissions } from './pages/AdminSubmissions';
import { MyJournal } from './pages/MyJournal';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedWbId, setSelectedWbId] = useState('master-mentor');
  const [selectedPageNum, setSelectedPageNum] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleSelectWorkbook = (wbOrId, pageNum) => {
    const wbId = typeof wbOrId === 'object' && wbOrId !== null ? wbOrId.id : wbOrId;
    setSelectedWbId(wbId);
    setSelectedPageNum(pageNum || 1);
    setCurrentPage('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setCurrentPage('task-filler');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      <Navbar onNavigate={(page) => setCurrentPage(page)} currentPage={currentPage} />

      <main className="main-content">
        {currentPage === 'dashboard' && (
          <Dashboard
            onSelectWorkbook={handleSelectWorkbook}
            onSelectTask={handleSelectTask}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'reader' && (
          <WorkbookReader
            key={`${selectedWbId}-${selectedPageNum}`}
            initialWorkbookId={selectedWbId}
            initialPageNum={selectedPageNum}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}

        {currentPage === 'workbooks' && (
          <WorkbookReader
            key={`${selectedWbId}-${selectedPageNum}`}
            initialWorkbookId={selectedWbId}
            initialPageNum={selectedPageNum}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}

        {currentPage === 'tasks' && (
          <TaskList
            onSelectTask={handleSelectTask}
            onNavigate={(page) => setCurrentPage(page)}
          />
        )}

        {currentPage === 'task-filler' && selectedTask && (
          <TaskFiller
            task={selectedTask}
            onBack={() => setCurrentPage('tasks')}
            onSubmitted={() => setCurrentPage('tasks')}
          />
        )}

        {currentPage === 'admin-builder' && (
          <AdminTaskBuilder
            onBack={() => setCurrentPage('dashboard')}
            onCreated={() => setCurrentPage('tasks')}
          />
        )}

        {currentPage === 'admin-submissions' && (
          <AdminSubmissions onBack={() => setCurrentPage('dashboard')} />
        )}

        {currentPage === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Fellowship Leader / Admin Panel
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                Manage custom questionnaires and inspect fellowship member submissions.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div
                  className="card card-interactive"
                  onClick={() => setCurrentPage('admin-builder')}
                  style={{ borderLeft: '4px solid var(--primary)' }}
                >
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    + Create Questionnaire
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Design custom fellowship tasks, rating scales, and reflection questions.
                  </p>
                </div>

                <div
                  className="card card-interactive"
                  onClick={() => setCurrentPage('admin-submissions')}
                  style={{ borderLeft: '4px solid #fbbf24' }}
                >
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    View Member Submissions
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Inspect filled-out responses by members and export to CSV.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'journal' && (
          <MyJournal
            onSelectWorkbook={handleSelectWorkbook}
          />
        )}
      </main>

      <BottomNav
        activeTab={currentPage}
        onTabChange={(tab) => {
          setCurrentPage(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WorkbookProvider>
        <MainApp />
      </WorkbookProvider>
    </AuthProvider>
  );
}
