import React from 'react';
import { Resume } from '@/types/resume';
import { Progress } from '@/components/ui/progress';
import { Check, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  resume: Resume;
}

const ProgressIndicator = ({ resume }: ProgressIndicatorProps) => {
  const sections = [
    {
      name: 'Personal Info',
      complete: Boolean(resume.personalInfo.fullName && resume.personalInfo.email),
    },
    {
      name: 'Summary',
      complete: Boolean(resume.personalInfo.summary && resume.personalInfo.summary.length > 20),
    },
    {
      name: 'Experience',
      complete: resume.experience.length > 0,
    },
    {
      name: 'Education',
      complete: resume.education.length > 0,
    },
    {
      name: 'Skills',
      complete: resume.skills.length >= 3,
    },
  ];

  const completedCount = sections.filter(s => s.complete).length;
  const progress = (completedCount / sections.length) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Resume Completeness</span>
        <span className="text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex flex-wrap gap-3 mt-2">
        {sections.map((section) => (
          <div
            key={section.name}
            className={`flex items-center gap-1.5 text-xs ${
              section.complete ? 'text-accent' : 'text-muted-foreground'
            }`}
          >
            {section.complete ? (
              <Check className="w-3 h-3" />
            ) : (
              <Circle className="w-3 h-3" />
            )}
            <span>{section.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
