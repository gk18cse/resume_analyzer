import React from 'react';
import { Resume } from '@/types/resume';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview = ({ resume }: ResumePreviewProps) => {
  const renderTemplate = () => {
    switch (resume.template) {
      case 'minimalist':
        return <MinimalistTemplate resume={resume} />;
      case 'modern':
        return <ModernTemplate resume={resume} />;
      case 'creative':
        return <CreativeTemplate resume={resume} />;
      case 'professional':
        return <ProfessionalTemplate resume={resume} />;
      default:
        return <ModernTemplate resume={resume} />;
    }
  };

  return (
    <div id="resume-preview" className="bg-white text-gray-900" style={{ width: '210mm', minHeight: '297mm' }}>
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
