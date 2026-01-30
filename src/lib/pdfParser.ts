import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedResume {
  fullText: string;
  sections: {
    contact: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
    certifications: string;
    projects: string;
    achievements: string;
  };
  metadata: {
    pageCount: number;
    wordCount: number;
    fileName: string;
  };
}

export interface ExtractedContact {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
}

// Section header patterns for detection
const SECTION_PATTERNS = {
  contact: /^(contact|personal\s+info|contact\s+info)/i,
  summary: /^(summary|professional\s+summary|objective|profile|about\s+me|career\s+objective)/i,
  experience: /^(experience|work\s+experience|employment|professional\s+experience|work\s+history)/i,
  education: /^(education|academic|qualifications|educational\s+background)/i,
  skills: /^(skills|technical\s+skills|core\s+competencies|expertise|proficiencies)/i,
  certifications: /^(certifications?|licenses?|credentials|professional\s+certifications?)/i,
  projects: /^(projects?|personal\s+projects?|key\s+projects?|portfolio)/i,
  achievements: /^(achievements?|accomplishments?|awards?|honors?|recognition)/i,
};

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

export async function parseResume(file: File): Promise<ParsedResume> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  const pageTexts: string[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    pageTexts.push(pageText);
    fullText += pageText + '\n';
  }
  
  const sections = extractSections(fullText);
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  
  return {
    fullText,
    sections,
    metadata: {
      pageCount: pdf.numPages,
      wordCount,
      fileName: file.name,
    },
  };
}

function extractSections(text: string): ParsedResume['sections'] {
  const lines = text.split(/\n/);
  const sections: ParsedResume['sections'] = {
    contact: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    certifications: '',
    projects: '',
    achievements: '',
  };
  
  let currentSection: keyof typeof sections | null = null;
  let currentContent: string[] = [];
  
  // First few lines are usually contact info
  const contactLines: string[] = [];
  let startIndex = 0;
  
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (line && !matchesAnySectionHeader(line)) {
      contactLines.push(line);
      startIndex = i + 1;
    } else if (matchesAnySectionHeader(line)) {
      break;
    }
  }
  
  sections.contact = contactLines.join('\n');
  
  // Process remaining lines
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const matchedSection = matchSectionHeader(line);
    
    if (matchedSection) {
      // Save previous section
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n');
      }
      currentSection = matchedSection;
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  
  // Save last section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n');
  }
  
  return sections;
}

function matchSectionHeader(line: string): keyof ParsedResume['sections'] | null {
  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(line)) {
      return section as keyof ParsedResume['sections'];
    }
  }
  return null;
}

function matchesAnySectionHeader(line: string): boolean {
  return Object.values(SECTION_PATTERNS).some(pattern => pattern.test(line));
}

export function extractContactInfo(text: string): ExtractedContact {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\/[\w-]+/i;
  
  const lines = text.split('\n').filter(l => l.trim());
  
  return {
    name: lines[0]?.trim() || '',
    email: text.match(emailRegex)?.[0] || '',
    phone: text.match(phoneRegex)?.[0] || '',
    linkedin: text.match(linkedinRegex)?.[0] || '',
    location: extractLocation(text),
  };
}

function extractLocation(text: string): string {
  // Common location patterns
  const locationPatterns = [
    /([A-Z][a-z]+,?\s+[A-Z]{2})/,  // City, ST
    /([A-Z][a-z]+,?\s+[A-Z][a-z]+)/,  // City, State
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  
  return '';
}

export function countKeywordMatches(resumeText: string, jobDescription: string): {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
} {
  // Extract keywords from job description
  const jobWords = jobDescription
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Get unique keywords (filter common words)
  const commonWords = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'have', 'from', 'will', 'been',
    'would', 'could', 'should', 'their', 'there', 'what', 'when', 'where', 'which',
    'about', 'into', 'more', 'other', 'some', 'such', 'only', 'also', 'than', 'then',
    'these', 'those', 'your', 'work', 'team', 'able', 'must', 'years', 'including',
  ]);
  
  const uniqueKeywords = [...new Set(jobWords)].filter(word => !commonWords.has(word));
  
  const resumeTextLower = resumeText.toLowerCase();
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  
  uniqueKeywords.forEach(keyword => {
    if (resumeTextLower.includes(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  const matchPercentage = uniqueKeywords.length > 0 
    ? Math.round((matchedKeywords.length / uniqueKeywords.length) * 100)
    : 0;
  
  return {
    matchedKeywords: [...new Set(matchedKeywords)].slice(0, 30),
    missingKeywords: [...new Set(missingKeywords)].slice(0, 30),
    matchPercentage,
  };
}
