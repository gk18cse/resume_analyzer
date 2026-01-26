import React from 'react';
import { TemplateType } from '@/types/resume';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const templates: { type: TemplateType; name: string; color: string }[] = [
  { type: 'minimalist', name: 'Minimalist', color: 'bg-foreground' },
  { type: 'modern', name: 'Modern', color: 'bg-primary' },
  { type: 'creative', name: 'Creative', color: 'bg-template-creative' },
  { type: 'professional', name: 'Professional', color: 'bg-template-professional' },
];

const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Template:</span>
      <div className="flex gap-2">
        {templates.map((template) => (
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
  );
};

export default TemplateSelector;
