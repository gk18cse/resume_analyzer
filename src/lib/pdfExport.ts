import html2canvas from 'html2canvas';
import { Resume } from '@/types/resume';

export const exportToPDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  // A4 dimensions in mm
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

  // Capture at high resolution for quality
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  // Calculate scale to fit content into exactly one A4 page
  const imgWidth = A4_WIDTH_MM;
  const imgHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

  // If content is taller than A4, scale it down to fit
  let finalWidth = imgWidth;
  let finalHeight = imgHeight;
  if (imgHeight > A4_HEIGHT_MM) {
    const scaleFactor = A4_HEIGHT_MM / imgHeight;
    finalWidth = imgWidth * scaleFactor;
    finalHeight = A4_HEIGHT_MM;
  }

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  });

  // Center horizontally if scaled down
  const xOffset = (A4_WIDTH_MM - finalWidth) / 2;
  pdf.addImage(imgData, 'JPEG', xOffset, 0, finalWidth, finalHeight);
  pdf.save(`${filename}.pdf`);
};

export const generateResumeFilename = (resume: Resume): string => {
  const name = resume.personalInfo.fullName || resume.name || 'resume';
  const sanitized = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const date = new Date().toISOString().split('T')[0];
  return `${sanitized}_${date}`;
};
