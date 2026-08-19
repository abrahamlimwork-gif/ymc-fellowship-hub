import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { StorageService } from '../utils/storage';
import mmFullData from '../data/master_mentor_full.json';
import tmdFullData from '../data/tmd_mothers_full.json';
import { ymcJointWorkbook } from '../data/ymcJointTrackData';
import { ccf7SecretsWorkbook } from '../data/ccf7SecretsData';

const WorkbookContext = createContext();

// Format YMC Joint Track as blocks
const ymcPages = ymcJointWorkbook.chapters.map((ch, idx) => ({
  pageNum: idx + 1,
  sheetNum: idx + 1,
  printedPage: idx + 1,
  displayLabel: `Week ${ch.number}`,
  title: ch.title,
  chapter: `Week ${ch.number}`,
  rawText: `${ch.title}\n${ch.subtitle}\n"${ch.scripture.text}" — ${ch.scripture.ref}\n${ch.essence}`,
  blocks: [
    { type: 'chapter_header', text: ch.title },
    { type: 'paragraph', text: ch.subtitle },
    { type: 'paragraph', text: `"${ch.scripture.text}" — ${ch.scripture.ref}` },
    { type: 'activity_badge', text: `ESSENCE & OUTCOME: ${ch.essence}` },
    ...ch.sections.map((sec) => {
      if (sec.type === 'text') {
        return { type: 'paragraph', text: `${sec.heading ? sec.heading + '\n' : ''}${sec.body}` };
      }
      return {
        type: 'question_box',
        id: sec.id,
        label: `${sec.label} (${sec.tag}): ${sec.prompt}`,
        placeholder: 'Write your reflection here...',
        linesCount: 3
      };
    })
  ]
}));

const ymcFullData = {
  id: 'ymc-joint',
  title: ymcJointWorkbook.title,
  subtitle: ymcJointWorkbook.subtitle,
  totalPages: ymcPages.length,
  pages: ymcPages,
  badge: 'Young Married Couples',
  coverColor: '#059669',
  coverImage: null,
  pdfUrl: null
};

// Format CCF Across: 7 Secrets to an Awesome Marriage as blocks
const ccf7SecretsPages = ccf7SecretsWorkbook.chapters.map((ch, idx) => ({
  pageNum: idx + 1,
  sheetNum: idx + 1,
  printedPage: idx + 1,
  displayLabel: `Secret ${ch.number}`,
  title: ch.title,
  chapter: `Secret ${ch.number}`,
  rawText: `${ch.title}\n${ch.subtitle}\n"${ch.scripture.text}" — ${ch.scripture.ref}\n${ch.essence}`,
  blocks: [
    { type: 'chapter_header', text: ch.title },
    { type: 'paragraph', text: ch.subtitle },
    { type: 'paragraph', text: `"${ch.scripture.text}" — ${ch.scripture.ref}` },
    { type: 'activity_badge', text: `BIBLICAL PRINCIPLE: ${ch.essence}` },
    ...ch.sections.map((sec) => {
      if (sec.type === 'text') {
        return { type: 'paragraph', text: `${sec.heading ? sec.heading + '\n' : ''}${sec.body}` };
      }
      return {
        type: 'question_box',
        id: sec.id,
        label: `${sec.label} (${sec.tag}): ${sec.prompt}`,
        placeholder: 'Type your answer or couple reflection here...',
        linesCount: 3
      };
    })
  ]
}));

const ccf7SecretsFullData = {
  id: 'ccf-7-secrets',
  title: ccf7SecretsWorkbook.title,
  subtitle: ccf7SecretsWorkbook.subtitle,
  totalPages: ccf7SecretsPages.length,
  pages: ccf7SecretsPages,
  badge: 'Couples / CCF Across',
  coverColor: '#b45309',
  coverImage: null,
  pdfUrl: null
};

const VERBATIM_WORKBOOKS = [
  {
    ...mmFullData,
    badge: 'Men / Husbands / Mentors',
    coverColor: '#1e3a8a',
    coverImage: './covers/master_mentor.jpg?v=2',
    pdfUrl: './pdfs/master_mentor.pdf'
  },
  {
    ...tmdFullData,
    badge: 'Wives / Mothers',
    coverColor: '#7c3aed',
    coverImage: './covers/tmd_mothers.jpg?v=2',
    pdfUrl: './pdfs/tmd_mothers.pdf'
  },
  ymcFullData,
  ccf7SecretsFullData
];

export function WorkbookProvider({ children }) {
  const { currentUser } = useAuth();
  const [workbooks, setWorkbooks] = useState(() => StorageService.getAllWorkbooks(VERBATIM_WORKBOOKS));
  const [userAnswers, setUserAnswers] = useState({});
  const [annotations, setAnnotations] = useState({});
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'
  const [questionnaires, setQuestionnaires] = useState(() => StorageService.getQuestionnaires());
  const [submissions, setSubmissions] = useState(() => StorageService.getAllSubmissions());

  const saveTimeoutRef = useRef(null);

  const createWorkbook = (wbData) => {
    const newWb = StorageService.saveCustomWorkbook(wbData);
    setWorkbooks(StorageService.getAllWorkbooks(VERBATIM_WORKBOOKS));
    return newWb;
  };

  const deleteWorkbook = (wbId) => {
    StorageService.deleteWorkbook(wbId);
    setWorkbooks(StorageService.getAllWorkbooks(VERBATIM_WORKBOOKS));
  };

  useEffect(() => {
    if (currentUser?.id) {
      const answers = StorageService.getUserAnswers(currentUser.id);
      setUserAnswers(answers || {});
      const allAnn = StorageService.getAllAnnotations();
      setAnnotations(allAnn?.[currentUser.id] || {});
    }
  }, [currentUser?.id]);

  const getAnswer = useCallback((workbookId, fieldId) => {
    return userAnswers?.[workbookId]?.[fieldId]?.value || '';
  }, [userAnswers]);

  const saveAnswer = useCallback((workbookId, fieldId, value) => {
    if (!currentUser?.id) return;
    setSaveStatus('saving');

    setUserAnswers((prev) => {
      const copy = { ...prev };
      if (!copy[workbookId]) copy[workbookId] = {};
      copy[workbookId][fieldId] = {
        value,
        updatedAt: new Date().toISOString()
      };
      return copy;
    });

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      StorageService.saveUserAnswer(currentUser.id, workbookId, 'answers', fieldId, value);
      setSaveStatus('saved');
    }, 350);
  }, [currentUser?.id]);

  // Page Annotations
  const getUserPageAnnotations = useCallback((workbookId, pageNum) => {
    return annotations?.[workbookId]?.[pageNum] || [];
  }, [annotations]);

  const saveUserPageAnnotation = useCallback((workbookId, pageNum, annotation) => {
    if (!currentUser?.id) return;
    setSaveStatus('saving');

    setAnnotations((prev) => {
      const copy = { ...prev };
      if (!copy[workbookId]) copy[workbookId] = {};
      if (!copy[workbookId][pageNum]) copy[workbookId][pageNum] = [];
      const list = [...copy[workbookId][pageNum]];
      const idx = list.findIndex(a => a.id === annotation.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...annotation, updatedAt: new Date().toISOString() };
      } else {
        list.push({ id: annotation.id || 'ann_' + Date.now(), createdAt: new Date().toISOString(), ...annotation });
      }
      copy[workbookId][pageNum] = list;
      return copy;
    });

    StorageService.saveUserAnnotation(currentUser.id, workbookId, pageNum, annotation);
    setSaveStatus('saved');
  }, [currentUser?.id]);

  const deleteUserPageAnnotation = useCallback((workbookId, pageNum, annotationId) => {
    if (!currentUser?.id) return;
    setAnnotations((prev) => {
      const copy = { ...prev };
      if (copy?.[workbookId]?.[pageNum]) {
        copy[workbookId][pageNum] = copy[workbookId][pageNum].filter(a => a.id !== annotationId);
      }
      return copy;
    });
    StorageService.deleteUserAnnotation(currentUser.id, workbookId, pageNum, annotationId);
  }, [currentUser?.id]);

  // Questionnaires
  const createQuestionnaire = (questData) => {
    const updated = StorageService.saveQuestionnaire(questData);
    setQuestionnaires([...updated]);
  };

  const deleteQuestionnaire = (id) => {
    const updated = StorageService.deleteQuestionnaire(id);
    setQuestionnaires([...updated]);
  };

  // Submissions
  const submitTask = (taskId, taskTitle, answers) => {
    if (!currentUser) return;
    const sub = StorageService.submitTask(
      currentUser.id,
      currentUser.name,
      currentUser.email,
      taskId,
      taskTitle,
      answers
    );
    setSubmissions((prev) => [sub, ...prev.filter(s => !(s.userId === currentUser.id && s.taskId === taskId))]);
    return sub;
  };

  const getUserSubmissions = (userId) => {
    return submissions.filter(s => s.userId === (userId || currentUser?.id));
  };

  // Progress Calculation
  const getWorkbookProgress = useCallback((workbookId) => {
    const wb = workbooks.find(w => w.id === workbookId);
    if (!wb) return { totalPages: 0, completedPages: 0, percent: 0, totalFields: 0, answeredFields: 0 };

    let totalFields = 0;
    let answeredFields = 0;
    const wbAns = userAnswers?.[workbookId] || {};

    wb.pages?.forEach((p) => {
      p.blocks?.forEach((b) => {
        if (b.type === 'question_box') {
          totalFields++;
          if (wbAns[b.id]?.value && wbAns[b.id].value.trim().length > 0) {
            answeredFields++;
          }
        } else if (b.type === 'inline_blank_line') {
          b.parts?.forEach((part) => {
            if (part.type === 'inline_input') {
              totalFields++;
              if (wbAns[part.id]?.value && wbAns[part.id].value.trim().length > 0) {
                answeredFields++;
              }
            }
          });
        }
      });
    });

    const percent = totalFields === 0 ? 0 : Math.round((answeredFields / totalFields) * 100);
    return { totalPages: wb.totalPages, percent, totalFields, answeredFields };
  }, [workbooks, userAnswers]);

  const deleteSubmission = (subId) => {
    const updated = StorageService.deleteSubmission(subId);
    setSubmissions([...updated]);
  };

  return (
    <WorkbookContext.Provider
      value={{
        workbooks,
        userAnswers,
        saveStatus,
        getAnswer,
        saveAnswer,
        getUserPageAnnotations,
        saveUserPageAnnotation,
        deleteUserPageAnnotation,
        questionnaires,
        createQuestionnaire,
        deleteQuestionnaire,
        createWorkbook,
        deleteWorkbook,
        submitTask,
        submissions,
        deleteSubmission,
        getUserSubmissions,
        getWorkbookProgress
      }}
    >
      {children}
    </WorkbookContext.Provider>
  );
}

export function useWorkbook() {
  return useContext(WorkbookContext);
}
