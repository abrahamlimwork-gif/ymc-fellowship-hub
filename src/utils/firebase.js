import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase Config (Can also use VITE_FIREBASE_* environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ymc-fellowship-hub.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ymc-fellowship-hub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ymc-fellowship-hub.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

// Cloud Firestore Sync Service
export const FirebaseService = {
  // Check if Firebase has valid live credentials
  isConfigured() {
    return (
      firebaseConfig.apiKey &&
      !firebaseConfig.apiKey.includes('YOUR_API_KEY') &&
      firebaseConfig.projectId &&
      !firebaseConfig.projectId.includes('your-project')
    );
  },

  // Save / Sync User Answer to Cloud
  async syncAnswer(userId, workbookId, fieldId, value) {
    if (!this.isConfigured() || !userId) return;
    try {
      const docRef = doc(db, 'users', userId, 'workbooks', workbookId);
      await setDoc(docRef, {
        [fieldId]: {
          value,
          updatedAt: new Date().toISOString()
        }
      }, { merge: true });
    } catch (err) {
      console.warn('Firebase syncAnswer notice (using local offline storage):', err.message);
    }
  },

  // Save / Sync Questionnaire
  async syncQuestionnaire(questionnaire) {
    if (!this.isConfigured() || !questionnaire?.id) return;
    try {
      await setDoc(doc(db, 'questionnaires', questionnaire.id), questionnaire, { merge: true });
    } catch (err) {
      console.warn('Firebase syncQuestionnaire notice:', err.message);
    }
  },

  // Delete Questionnaire
  async deleteQuestionnaire(id) {
    if (!this.isConfigured()) return;
    try {
      await deleteDoc(doc(db, 'questionnaires', id));
    } catch (err) {
      console.warn('Firebase deleteQuestionnaire notice:', err.message);
    }
  },

  // Save / Sync Custom Workbook
  async syncWorkbook(workbook) {
    if (!this.isConfigured() || !workbook?.id) return;
    try {
      await setDoc(doc(db, 'workbooks', workbook.id), workbook, { merge: true });
    } catch (err) {
      console.warn('Firebase syncWorkbook notice:', err.message);
    }
  },

  // Delete Custom Workbook
  async deleteWorkbook(wbId) {
    if (!this.isConfigured()) return;
    try {
      await deleteDoc(doc(db, 'workbooks', wbId));
    } catch (err) {
      console.warn('Firebase deleteWorkbook notice:', err.message);
    }
  },

  // Save Member Submission
  async syncSubmission(submission) {
    if (!this.isConfigured() || !submission?.id) return;
    try {
      await setDoc(doc(db, 'submissions', submission.id), submission, { merge: true });
    } catch (err) {
      console.warn('Firebase syncSubmission notice:', err.message);
    }
  },

  // Delete Member Submission
  async deleteSubmission(subId) {
    if (!this.isConfigured()) return;
    try {
      await deleteDoc(doc(db, 'submissions', subId));
    } catch (err) {
      console.warn('Firebase deleteSubmission notice:', err.message);
    }
  }
};
