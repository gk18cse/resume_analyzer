import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Resume, createEmptyResume } from '@/types/resume';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface ResumeContextType {
  resumes: Resume[];
  currentResume: Resume | null;
  setCurrentResume: (resume: Resume | null) => void;
  createResume: (name?: string) => Resume | null;
  updateResume: (resume: Resume) => void;
  deleteResume: (id: string) => void;
  canCreateMore: boolean;
  history: Resume[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const RESUMES_KEY_PREFIX = 'resume_builder_resumes_';
const MAX_RESUMES = 5;
const MAX_HISTORY = 50;

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResumeState] = useState<Resume | null>(null);
  const [history, setHistory] = useState<Resume[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const getStorageKey = useCallback(() => {
    return user ? `${RESUMES_KEY_PREFIX}${user.id}` : null;
  }, [user]);

  useEffect(() => {
    const key = getStorageKey();
    if (key) {
      const stored = localStorage.getItem(key);
      if (stored) {
        setResumes(JSON.parse(stored));
      } else {
        setResumes([]);
      }
    } else {
      setResumes([]);
    }
    setCurrentResumeState(null);
    setHistory([]);
    setHistoryIndex(-1);
  }, [getStorageKey]);

  const saveResumes = useCallback((newResumes: Resume[]) => {
    const key = getStorageKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(newResumes));
    }
    setResumes(newResumes);
  }, [getStorageKey]);

  const setCurrentResume = (resume: Resume | null) => {
    setCurrentResumeState(resume);
    if (resume) {
      setHistory([resume]);
      setHistoryIndex(0);
    } else {
      setHistory([]);
      setHistoryIndex(-1);
    }
  };

  const createResume = (name?: string): Resume | null => {
    if (resumes.length >= MAX_RESUMES) {
      return null;
    }

    const newResume = createEmptyResume(uuidv4(), name);
    const newResumes = [...resumes, newResume];
    saveResumes(newResumes);
    setCurrentResume(newResume);
    return newResume;
  };

  const updateResume = useCallback((resume: Resume) => {
    const updatedResume = { ...resume, updatedAt: new Date().toISOString() };
    
    // Update in resumes list
    const newResumes = resumes.map(r => r.id === resume.id ? updatedResume : r);
    saveResumes(newResumes);
    
    // Update current resume
    setCurrentResumeState(updatedResume);
    
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedResume);
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [resumes, history, historyIndex, saveResumes]);

  const deleteResume = (id: string) => {
    const newResumes = resumes.filter(r => r.id !== id);
    saveResumes(newResumes);
    if (currentResume?.id === id) {
      setCurrentResume(null);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousResume = history[newIndex];
      setCurrentResumeState(previousResume);
      
      const newResumes = resumes.map(r => r.id === previousResume.id ? previousResume : r);
      const key = getStorageKey();
      if (key) {
        localStorage.setItem(key, JSON.stringify(newResumes));
      }
      setResumes(newResumes);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextResume = history[newIndex];
      setCurrentResumeState(nextResume);
      
      const newResumes = resumes.map(r => r.id === nextResume.id ? nextResume : r);
      const key = getStorageKey();
      if (key) {
        localStorage.setItem(key, JSON.stringify(newResumes));
      }
      setResumes(newResumes);
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        setCurrentResume,
        createResume,
        updateResume,
        deleteResume,
        canCreateMore: resumes.length < MAX_RESUMES,
        history,
        historyIndex,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
