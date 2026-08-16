import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Check, UserPlus, X } from 'lucide-react';

export function AccountSwitcherModal({ isOpen, onClose }) {
  const { currentUser, users, switchUser, registerUser } = useAuth();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: 'Husband / YMC Member',
    role: 'member'
  });

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    registerUser(formData);
    setIsAddingNew(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Fellowship Accounts</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Each account has strictly isolated answers & progress.
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {!isAddingNew ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {users.map((user) => {
                const isCurrent = user.id === currentUser?.id;
                return (
                  <div
                    key={user.id}
                    className={`card card-interactive`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderColor: isCurrent ? 'var(--primary)' : 'var(--border-color)',
                      background: isCurrent ? 'var(--primary-light)' : 'var(--bg-card)'
                    }}
                    onClick={() => {
                      switchUser(user);
                      onClose();
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        className="account-avatar"
                        style={{
                          width: 38,
                          height: 38,
                          fontSize: '0.85rem',
                          background: user.role === 'admin' ? '#1e293b' : 'var(--primary)'
                        }}
                      >
                        {user.avatar || user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</span>
                          {user.role === 'admin' && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '0.68rem',
                                padding: '1px 6px',
                                background: '#1e293b',
                                color: '#fbbf24',
                                borderRadius: '4px',
                                fontWeight: 700
                              }}
                            >
                              <Shield size={10} /> ADMIN
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          {user.title || user.email}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                        <Check size={16} /> Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setIsAddingNew(true)}
            >
              <UserPlus size={16} /> Add / Register New Member
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Email or Username
                </label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Role in Fellowship
                </label>
                <select
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                >
                  <option value="Husband / YMC Member">Husband / YMC Member</option>
                  <option value="Wife / TMD Member">Wife / TMD Member</option>
                  <option value="Mentor Couple">Mentor Couple</option>
                  <option value="Fellowship Leader / Admin">Fellowship Leader / Admin</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Account Permissions
                </label>
                <select
                  className="form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="member">Member (Workbooks & Tasks)</option>
                  <option value="admin">Admin (Create Questionnaires & View Submissions)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => setIsAddingNew(false)}
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                Save & Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
