import { defaultQuestionnaires } from '../data/defaultQuestionnaires';

const STORAGE_KEYS = {
  USERS: 'ymc_hub_users_v1',
  CURRENT_USER: 'ymc_hub_current_user_v1',
  ANSWERS: 'ymc_hub_answers_v1',
  ANNOTATIONS: 'ymc_hub_annotations_v1',
  QUESTIONNAIRES: 'ymc_hub_questionnaires_v1',
  SUBMISSIONS: 'ymc_hub_submissions_v1',
  THEME: 'ymc_hub_theme_v1'
};

const DEFAULT_USERS = [
  {
    id: 'user-admin',
    name: 'Pastor Dave',
    email: 'admin@ymc.org',
    role: 'admin',
    title: 'Fellowship Leader & Admin',
    avatar: 'PD'
  },
  {
    id: 'user-khyle',
    name: 'Khyle Alex',
    email: 'khyle@ymc.org',
    role: 'member',
    title: 'Husband / YMC Member',
    spouseId: 'user-maria',
    spouseName: 'Maria',
    avatar: 'KA'
  },
  {
    id: 'user-maria',
    name: 'Maria Santos',
    email: 'maria@ymc.org',
    role: 'member',
    title: 'Wife / TMD Member',
    spouseId: 'user-khyle',
    spouseName: 'Khyle Alex',
    avatar: 'MS'
  },
  {
    id: 'user-john',
    name: 'John & Grace Miller',
    email: 'john@ymc.org',
    role: 'member',
    title: 'Mentor Couple',
    avatar: 'JM'
  }
];

export const StorageService = {
  // Users
  getUsers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveUser(newUser) {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...newUser };
    } else {
      users.push({
        id: 'user-' + Date.now(),
        avatar: newUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
        role: newUser.role || 'member',
        ...newUser
      });
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users;
  },

  // Active Session
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) return JSON.parse(stored);
      const defaultUser = DEFAULT_USERS[1]; // default to Khyle
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return DEFAULT_USERS[1];
    }
  },

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  // User-Isolated Workbook Answers
  getAllAnswers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANSWERS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  getUserAnswers(userId) {
    const all = this.getAllAnswers();
    return all[userId] || {};
  },

  saveUserAnswer(userId, workbookId, category, fieldId, value) {
    const all = this.getAllAnswers();
    if (!all[userId]) all[userId] = {};
    if (!all[userId][workbookId]) all[userId][workbookId] = {};

    all[userId][workbookId][fieldId] = {
      value,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(all));
    return all[userId];
  },

  // Direct Page Annotations (Tapped directly on the PDF Page)
  getAllAnnotations() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANNOTATIONS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  getUserAnnotations(userId, workbookId, pageNum) {
    const all = this.getAllAnnotations();
    return all?.[userId]?.[workbookId]?.[pageNum] || [];
  },

  saveUserAnnotation(userId, workbookId, pageNum, annotation) {
    const all = this.getAllAnnotations();
    if (!all[userId]) all[userId] = {};
    if (!all[userId][workbookId]) all[userId][workbookId] = {};
    if (!all[userId][workbookId][pageNum]) all[userId][workbookId][pageNum] = [];

    const pageList = all[userId][workbookId][pageNum];
    const existingIndex = pageList.findIndex(a => a.id === annotation.id);

    if (existingIndex >= 0) {
      pageList[existingIndex] = { ...pageList[existingIndex], ...annotation, updatedAt: new Date().toISOString() };
    } else {
      pageList.push({
        id: annotation.id || 'ann_' + Date.now(),
        createdAt: new Date().toISOString(),
        ...annotation
      });
    }

    localStorage.setItem(STORAGE_KEYS.ANNOTATIONS, JSON.stringify(all));
    return pageList;
  },

  deleteUserAnnotation(userId, workbookId, pageNum, annotationId) {
    const all = this.getAllAnnotations();
    if (all?.[userId]?.[workbookId]?.[pageNum]) {
      all[userId][workbookId][pageNum] = all[userId][workbookId][pageNum].filter(a => a.id !== annotationId);
      localStorage.setItem(STORAGE_KEYS.ANNOTATIONS, JSON.stringify(all));
      return all[userId][workbookId][pageNum];
    }
    return [];
  },

  // Questionnaires (Admin Tasks)
  getQuestionnaires() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(defaultQuestionnaires));
        return defaultQuestionnaires;
      }
      return JSON.parse(stored);
    } catch {
      return defaultQuestionnaires;
    }
  },

  saveQuestionnaire(newQuestionnaire) {
    const list = this.getQuestionnaires();
    const existingIndex = list.findIndex(q => q.id === newQuestionnaire.id);
    if (existingIndex >= 0) {
      list[existingIndex] = newQuestionnaire;
    } else {
      list.unshift({
        id: 'quest-' + Date.now(),
        createdAt: new Date().toISOString(),
        ...newQuestionnaire
      });
    }
    localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(list));
    return list;
  },

  deleteQuestionnaire(id) {
    let list = this.getQuestionnaires();
    list = list.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(list));
    return list;
  },

  // Submissions for Questionnaires
  getAllSubmissions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  submitTask(userId, userName, userEmail, taskId, taskTitle, answers) {
    const subs = this.getAllSubmissions();
    const existingIndex = subs.findIndex(s => s.userId === userId && s.taskId === taskId);
    const submissionRecord = {
      id: existingIndex >= 0 ? subs[existingIndex].id : 'sub-' + Date.now(),
      userId,
      userName,
      userEmail,
      taskId,
      taskTitle,
      answers,
      submittedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      subs[existingIndex] = submissionRecord;
    } else {
      subs.unshift(submissionRecord);
    }

    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
    return submissionRecord;
  },

  deleteSubmission(id) {
    let subs = this.getAllSubmissions();
    subs = subs.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
    return subs;
  },

  // Theme
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
};
