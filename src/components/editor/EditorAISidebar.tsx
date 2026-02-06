import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Target, Bot, FileCheck } from 'lucide-react';
import { Resume } from '@/types/resume';
import ATSScoreAnalyzer from '@/components/editor/ATSScoreAnalyzer';
import AISuggestionPanel from '@/components/editor/AISuggestionPanel';
import JobDescriptionMatcher from '@/components/editor/JobDescriptionMatcher';
import AIResumeAssistant from '@/components/editor/AIResumeAssistant';

interface EditorAISidebarProps {
  resume: Resume;
  onApplySuggestion?: (section: string, value: string) => void;
  onApplyBullets?: (bullets: string[], experienceId: string) => void;
  onApplySummary?: (summary: string) => void;
}

const EditorAISidebar = ({
  resume,
  onApplySuggestion,
  onApplyBullets,
  onApplySummary,
}: EditorAISidebarProps) => {
  return (
    <Tabs defaultValue="ats" className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-9 mb-3">
        <TabsTrigger value="ats" className="text-xs gap-1 px-1">
          <FileCheck className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">ATS</span>
        </TabsTrigger>
        <TabsTrigger value="suggestions" className="text-xs gap-1 px-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">AI Tips</span>
        </TabsTrigger>
        <TabsTrigger value="match" className="text-xs gap-1 px-1">
          <Target className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Match</span>
        </TabsTrigger>
        <TabsTrigger value="assistant" className="text-xs gap-1 px-1">
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">AI Bot</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ats" className="mt-0">
        <ATSScoreAnalyzer resume={resume} />
      </TabsContent>

      <TabsContent value="suggestions" className="mt-0">
        <AISuggestionPanel
          resume={resume}
          onApplySuggestion={onApplySuggestion}
        />
      </TabsContent>

      <TabsContent value="match" className="mt-0">
        <JobDescriptionMatcher resume={resume} />
      </TabsContent>

      <TabsContent value="assistant" className="mt-0">
        <AIResumeAssistant
          resume={resume}
          onApplyBullets={onApplyBullets}
          onApplySummary={onApplySummary}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EditorAISidebar;
