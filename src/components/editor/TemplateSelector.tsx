import React from 'react';
import { TemplateType } from '@/types/resume';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const templates: { type: TemplateType; name: string; color: string; ats?: boolean }[] = [
  { type: 'minimalist', name: 'Minimalist', color: 'bg-foreground' },
  { type: 'modern', name: 'Modern', color: 'bg-primary' },
  { type: 'creative', name: 'Creative', color: 'bg-template-creative' },
  { type: 'professional', name: 'Professional', color: 'bg-template-professional' },
  { type: 'academic', name: 'Academic', color: 'bg-[#1e3a5f]', ats: true },
  { type: 'technical', name: 'Technical', color: 'bg-[#0d9488]', ats: true },
  { type: 'executive', name: 'Executive', color: 'bg-[#7c2d4b]', ats: true },
];

const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="flex flex-col gap-2 overflow-x-auto pb-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Standard:</span>
        <div className="flex gap-2">
          {templates.filter(t => !t.ats).map((template) => (
            <button
              key={template.type}
              onClick={() => onTemplateChange(template.type)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                selectedTemplate === template.type
                  ? 'bg-card shadow-card border border-border'
                  : 'hover:bg-card/50'
              )}
            >
              <span className={cn('w-3 h-3 rounded-full', template.color)} />
              <span>{template.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1">
          ATS-Friendly:
          <span className="text-xs text-green-600 font-normal">(90+ Score)</span>
        </span>
        <div className="flex gap-2">
          {templates.filter(t => t.ats).map((template) => (
            <button
              key={template.type}
              onClick={() => onTemplateChange(template.type)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                selectedTemplate === template.type
                  ? 'bg-card shadow-card border border-border ring-2 ring-green-500/50'
                  : 'hover:bg-card/50'
              )}
            >
              <span className={cn('w-3 h-3 rounded-full', template.color)} />
              <span>{template.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
