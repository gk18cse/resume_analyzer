import html2pdf from 'html2pdf.js';
import { Resume } from '@/types/resume';

export const exportToPDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const opt = {
    margin: 0,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: { 
      unit: 'mm' as const, 
      format: 'a4' as const, 
      orientation: 'portrait' as const
    },
    pagebreak: { mode: 'avoid-all' as const }
  };

  await html2pdf().set(opt).from(element).save();
};

export const generateResumeFilename = (resume: Resume): string => {
  const name = resume.personalInfo.fullName || resume.name || 'resume';
  const sanitized = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  return `${sanitized}_${date}`;
};
