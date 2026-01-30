import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ParsedResume, extractContactInfo } from '@/lib/pdfParser';
import { cn } from '@/lib/utils';

interface OptimizedResumePreviewProps {
  parsedResume: ParsedResume;
  onExport: () => void;
}

const OptimizedResumePreview = ({ parsedResume, onExport }: OptimizedResumePreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const contact = extractContactInfo(parsedResume.sections.contact || parsedResume.fullText.slice(0, 500));

  const formatSection = (text: string): string[] => {
    if (!text) return [];
    return text
      .split(/\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-primary" />
          ATS-Optimized Preview
        </CardTitle>
        <Button onClick={onExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-600 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            This preview is formatted for maximum ATS compatibility
          </p>
        </div>

        {/* ATS-Friendly Resume Preview */}
        <div 
          ref={previewRef}
          id="ats-optimized-resume"
          className="bg-white text-black p-8 rounded-lg shadow-inner border max-h-[600px] overflow-y-auto"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {/* Header / Contact */}
          <div className="text-center mb-6 border-b border-gray-300 pb-4">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">
              {contact.name || 'Your Name'}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              {contact.email && <p>{contact.email}</p>}
              {contact.phone && <p>{contact.phone}</p>}
              {contact.location && <p>{contact.location}</p>}
              {contact.linkedin && <p>{contact.linkedin}</p>}
            </div>
          </div>

          {/* Professional Summary */}
          {parsedResume.sections.summary && (
            <div className="mb-5">
              <h2 className="text-base font-bold uppercase tracking-wide text-gray-900 border-b border-gray-200 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {parsedResume.sections.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {parsedResume.sections.experience && (
            <div className="mb-5">
              <h2 className="text-base font-bold uppercase tracking-wide text-gray-900 border-b border-gray-200 pb-1 mb-2">
                Work Experience
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                {formatSection(parsedResume.sections.experience).map((line, i) => (
                  <p key={i} className={cn(
                    line.match(/^[•\-\*]/) ? 'pl-4' : '',
                    'leading-relaxed'
                  )}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {parsedResume.sections.skills && (
            <div className="mb-5">
              <h2 className="text-base font-bold uppercase tracking-wide text-gray-900 border-b border-gray-200 pb-1 mb-2">
                Skills
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {parsedResume.sections.skills}
              </p>
            </div>
          )}

          {/* Education */}
          {parsedResume.sections.education && (
            <div className="mb-5">
              <h2 className="text-base font-bold uppercase tracking-wide text-gray-900 border-b border-gray-200 pb-1 mb-2">
                Education
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                {formatSection(parsedResume.sections.education).map((line, i) => (
                  <p key={i} className="leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {parsedResume.sections.certifications && (
            <div className="mb-5">
              <h2 className="text-base font-bold uppercase tracking-wide text-gray-900 border-b border-gray-200 pb-1 mb-2">
                Certifications
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                {formatSection(parsedResume.sections.certifications).map((line, i) => (
                  <p key={i} className="leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {parsedResume.sections.projects && (
            <div className="mb-5">
              <h2 className="text-base font-bold uppercase tracking-wide text-gray-900 border-b border-gray-200 pb-1 mb-2">
                Projects
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                {formatSection(parsedResume.sections.projects).map((line, i) => (
                  <p key={i} className={cn(
                    line.match(/^[•\-\*]/) ? 'pl-4' : '',
                    'leading-relaxed'
                  )}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {parsedResume.sections.achievements && (
            <div className="mb-5">
              <h2 className="text-base font-bold uppercase tracking-wide text-gray-900 border-b border-gray-200 pb-1 mb-2">
                Achievements
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                {formatSection(parsedResume.sections.achievements).map((line, i) => (
                  <p key={i} className="leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          Single-column layout • Standard fonts • No tables or graphics • ATS-compliant formatting
        </p>
      </CardContent>
    </Card>
  );
};

export default OptimizedResumePreview;
