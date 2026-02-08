import React from 'react';
import { Resume } from '@/types/resume';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import AcademicTemplate from './templates/AcademicTemplate';
import TechnicalTemplate from './templates/TechnicalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import ClassicTemplate from './templates/ClassicTemplate';

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
      case 'academic':
        return <AcademicTemplate resume={resume} />;
      case 'technical':
        return <TechnicalTemplate resume={resume} />;
      case 'executive':
        return <ExecutiveTemplate resume={resume} />;
      case 'classic':
        return <ClassicTemplate resume={resume} />;
      default:
        return <ModernTemplate resume={resume} />;
    }
  };

  return (
    <div 
      id="resume-preview" 
      className="bg-white text-gray-900 a4-resume a4-resume-content" 
      style={{ 
        width: '210mm', 
        minHeight: '297mm',
        maxHeight: '297mm',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
