import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Resume } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';

export interface AISuggestion {
  type: 'improvement' | 'missing' | 'grammar' | 'keyword';
  section: string;
  current: string | null;
  suggested: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface AIAnalysisResult {
  suggestions: AISuggestion[];
  overallFeedback: string;
  missingSections: string[];
  strengthScore: number;
}

export interface JobMatchResult {
  matchScore: number;
  matchedKeywords: { keyword: string; found: boolean; importance: string }[];
  missingKeywords: string[];
  formattingFeedback: string[];
  optimizationTips: string[];
  grammarIssues: { text: string; suggestion: string }[];
  sectionFeedback: Record<string, string>;
}

export interface SmartQuestion {
  question: string;
  section: string;
  context: string;
}

export function useAIAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const callAI = useCallback(async (body: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-resume-assistant', { body });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) {
        toast({ title: 'AI Error', description: data.error, variant: 'destructive' });
        throw new Error(data.error);
      }
      return data;
    } catch (err: any) {
      const msg = err?.message || 'AI request failed';
      setError(msg);
      toast({ title: 'AI Error', description: msg, variant: 'destructive' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getSuggestions = useCallback(async (resume: Resume): Promise<AIAnalysisResult | null> => {
    return callAI({ action: 'suggestions', resumeData: resume });
  }, [callAI]);

  const generateBulletPoints = useCallback(async (context: { position: string; company: string; description?: string }): Promise<string[] | null> => {
    const data = await callAI({ action: 'bullet_points', context });
    return data?.bullets || null;
  }, [callAI]);

  const generateSummary = useCallback(async (resume: Resume, targetRole?: string): Promise<string | null> => {
    const data = await callAI({ action: 'summary', resumeData: resume, context: { targetRole } });
    return data?.summary || null;
  }, [callAI]);

  const matchJobDescription = useCallback(async (resume: Resume, jobDescription: string): Promise<JobMatchResult | null> => {
    return callAI({ action: 'job_match', resumeData: resume, jobDescription });
  }, [callAI]);

  const getSmartQuestions = useCallback(async (resume: Resume): Promise<SmartQuestion[] | null> => {
    const data = await callAI({ action: 'smart_questions', resumeData: resume });
    return data?.questions || null;
  }, [callAI]);

  return {
    isLoading,
    error,
    getSuggestions,
    generateBulletPoints,
    generateSummary,
    matchJobDescription,
    getSmartQuestions,
  };
}
