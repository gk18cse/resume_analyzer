import { ParsedResume, extractContactInfo } from './pdfParser';
import { ACTION_WORDS, SKILL_KEYWORDS } from '@/types/resume';

export interface ATSAnalysisResult {
  overallScore: number;
  categories: CategoryResult[];
  criticalIssues: string[];
  improvements: string[];
}

export interface CategoryResult {
  name: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'error';
  issues: string[];
  suggestions: string[];
}

export function analyzeResumeText(parsedResume: ParsedResume): ATSAnalysisResult {
  const categories: CategoryResult[] = [];
  
  // 1. Contact Information (15 points)
  categories.push(analyzeContact(parsedResume.sections.contact));
  
  // 2. Professional Summary (15 points)
  categories.push(analyzeSummary(parsedResume.sections.summary));
  
  // 3. Work Experience (25 points)
  categories.push(analyzeExperience(parsedResume.sections.experience));
  
  // 4. Skills Section (15 points)
  categories.push(analyzeSkills(parsedResume.sections.skills));
  
  // 5. Education Section (10 points)
  categories.push(analyzeEducation(parsedResume.sections.education));
  
  // 6. Keyword Optimization (10 points)
  categories.push(analyzeKeywords(parsedResume.fullText));
  
  // 7. Formatting & Layout (10 points)
  categories.push(analyzeFormatting(parsedResume));
  
  const totalScore = categories.reduce((acc, cat) => acc + cat.score, 0);
  const maxTotal = categories.reduce((acc, cat) => acc + cat.maxScore, 0);
  const overallScore = Math.round((totalScore / maxTotal) * 100);
  
  const criticalIssues = categories
    .filter(c => c.status === 'error')
    .flatMap(c => c.issues);
  
  const improvements = categories
    .flatMap(c => c.suggestions)
    .slice(0, 10);
  
  return {
    overallScore,
    categories,
    criticalIssues,
    improvements,
  };
}

function analyzeContact(contactText: string): CategoryResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 15;
  
  const contact = extractContactInfo(contactText);
  
  if (contact.name) score += 3;
  else issues.push('Full name not detected');
  
  if (contact.email) {
    score += 4;
    if (!contact.email.includes('@')) issues.push('Email format appears invalid');
  } else issues.push('Email address not found');
  
  if (contact.phone) score += 4;
  else issues.push('Phone number not found');
  
  if (contact.location) score += 2;
  else suggestions.push('Consider adding your location');
  
  if (contact.linkedin) score += 2;
  else suggestions.push('Adding LinkedIn profile increases credibility');
  
  return {
    name: 'Contact Information',
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 12 ? 'good' : score >= 8 ? 'warning' : 'error',
    issues,
    suggestions,
  };
}

function analyzeSummary(summaryText: string): CategoryResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 15;
  
  if (!summaryText || summaryText.trim().length < 20) {
    issues.push('Professional summary is missing or too short');
    suggestions.push('Add a 2-4 sentence summary highlighting key qualifications');
    return {
      name: 'Professional Summary',
      score: 0,
      maxScore,
      status: 'error',
      issues,
      suggestions,
    };
  }
  
  score += 5;
  
  const wordCount = summaryText.split(/\s+/).filter(Boolean).length;
  
  if (wordCount >= 30 && wordCount <= 100) {
    score += 4;
  } else if (wordCount < 30) {
    suggestions.push('Summary is too short. Aim for 30-100 words');
  } else {
    suggestions.push('Summary is too long. Keep it under 100 words');
  }
  
  // Check for action words
  const hasActionWords = ACTION_WORDS.some(word => 
    summaryText.toLowerCase().includes(word.toLowerCase())
  );
  if (hasActionWords) score += 3;
  else suggestions.push('Include action verbs like "Led", "Developed", "Achieved"');
  
  // Check for quantifiable achievements
  const hasNumbers = /\d+/.test(summaryText);
  if (hasNumbers) score += 3;
  else suggestions.push('Add quantifiable achievements (e.g., "5+ years experience")');
  
  return {
    name: 'Professional Summary',
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 12 ? 'good' : score >= 8 ? 'warning' : 'error',
    issues,
    suggestions,
  };
}

function analyzeExperience(experienceText: string): CategoryResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 25;
  
  if (!experienceText || experienceText.trim().length < 50) {
    issues.push('Work experience section is missing or too brief');
    suggestions.push('Add detailed work experience with job titles, companies, and dates');
    return {
      name: 'Work Experience',
      score: 0,
      maxScore,
      status: 'error',
      issues,
      suggestions,
    };
  }
  
  score += 8;
  
  // Check for dates
  const datePatterns = [
    /\d{4}\s*[-–]\s*\d{4}/,
    /\d{4}\s*[-–]\s*present/i,
    /\d{1,2}\/\d{4}/,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}/i,
  ];
  const hasDates = datePatterns.some(pattern => pattern.test(experienceText));
  if (hasDates) score += 4;
  else issues.push('Date format not detected - ensure consistent date formatting');
  
  // Check for action words
  const actionWordCount = ACTION_WORDS.filter(word => 
    experienceText.toLowerCase().includes(word.toLowerCase())
  ).length;
  
  if (actionWordCount >= 5) score += 5;
  else if (actionWordCount >= 2) score += 3;
  else suggestions.push('Use more action verbs like "Managed", "Developed", "Increased"');
  
  // Check for quantifiable achievements
  const numbers = experienceText.match(/\d+%?/g) || [];
  if (numbers.length >= 3) score += 4;
  else if (numbers.length >= 1) score += 2;
  else suggestions.push('Add metrics and numbers (e.g., "increased efficiency by 30%")');
  
  // Check for bullet points
  const hasBullets = /[•\-\*]/.test(experienceText);
  if (hasBullets) score += 4;
  else suggestions.push('Use bullet points for better ATS parsing and readability');
  
  return {
    name: 'Work Experience',
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 20 ? 'good' : score >= 12 ? 'warning' : 'error',
    issues,
    suggestions,
  };
}

function analyzeSkills(skillsText: string): CategoryResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 15;
  
  if (!skillsText || skillsText.trim().length < 20) {
    issues.push('Skills section is missing or too brief');
    suggestions.push('Add a dedicated skills section with 8-15 relevant skills');
    return {
      name: 'Skills Section',
      score: 0,
      maxScore,
      status: 'error',
      issues,
      suggestions,
    };
  }
  
  score += 5;
  
  // Count skills (rough estimate)
  const skillsLower = skillsText.toLowerCase();
  const matchingKeywords = SKILL_KEYWORDS.filter(keyword => 
    skillsLower.includes(keyword.toLowerCase())
  );
  
  if (matchingKeywords.length >= 8) score += 6;
  else if (matchingKeywords.length >= 4) score += 4;
  else if (matchingKeywords.length >= 2) score += 2;
  
  if (matchingKeywords.length < 5) {
    suggestions.push('Include more industry-standard keywords like: ' + 
      SKILL_KEYWORDS.slice(0, 6).join(', '));
  }
  
  // Check for skill categories
  const hasCategories = /(technical|soft|programming|tools|languages|frameworks)/i.test(skillsText);
  if (hasCategories) score += 4;
  else suggestions.push('Consider organizing skills into categories (Technical, Soft Skills, etc.)');
  
  return {
    name: 'Skills Section',
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 12 ? 'good' : score >= 8 ? 'warning' : 'error',
    issues,
    suggestions,
  };
}

function analyzeEducation(educationText: string): CategoryResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 10;
  
  if (!educationText || educationText.trim().length < 20) {
    issues.push('Education section is missing');
    suggestions.push('Add your educational background with institution, degree, and dates');
    return {
      name: 'Education Section',
      score: 0,
      maxScore,
      status: 'error',
      issues,
      suggestions,
    };
  }
  
  score += 4;
  
  // Check for degree keywords
  const degreePatterns = /(bachelor|master|phd|associate|diploma|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?b\.?a\.?)/i;
  if (degreePatterns.test(educationText)) score += 3;
  else suggestions.push('Ensure degree title is clearly stated');
  
  // Check for graduation year
  const hasYear = /\d{4}/.test(educationText);
  if (hasYear) score += 2;
  else suggestions.push('Include graduation year');
  
  // Check for GPA
  const hasGPA = /gpa|grade/i.test(educationText);
  if (hasGPA) score += 1;
  else if (!hasGPA) suggestions.push('Consider adding GPA if 3.0 or higher');
  
  return {
    name: 'Education Section',
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 8 ? 'good' : score >= 5 ? 'warning' : 'error',
    issues,
    suggestions,
  };
}

function analyzeKeywords(fullText: string): CategoryResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 10;
  
  const textLower = fullText.toLowerCase();
  
  // Count action words
  const actionWordCount = ACTION_WORDS.filter(word => 
    textLower.includes(word.toLowerCase())
  ).length;
  
  if (actionWordCount >= 10) score += 5;
  else if (actionWordCount >= 5) score += 3;
  else if (actionWordCount >= 2) score += 1;
  
  if (actionWordCount < 5) {
    suggestions.push(`Found ${actionWordCount} action words. Aim for 10+ for better ATS matching`);
  }
  
  // Count skill keywords
  const skillKeywordCount = SKILL_KEYWORDS.filter(word => 
    textLower.includes(word.toLowerCase())
  ).length;
  
  if (skillKeywordCount >= 8) score += 5;
  else if (skillKeywordCount >= 4) score += 3;
  else if (skillKeywordCount >= 2) score += 1;
  
  if (skillKeywordCount < 5) {
    suggestions.push(`Found ${skillKeywordCount} industry keywords. Include more relevant skills`);
  }
  
  return {
    name: 'Keyword Optimization',
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 8 ? 'good' : score >= 5 ? 'warning' : 'error',
    issues,
    suggestions,
  };
}

function analyzeFormatting(parsedResume: ParsedResume): CategoryResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 10;
  
  const { fullText, metadata, sections } = parsedResume;
  
  // Check page count
  if (metadata.pageCount <= 2) score += 3;
  else {
    issues.push(`Resume is ${metadata.pageCount} pages. ATS prefers 1-2 pages`);
  }
  
  // Check word count
  if (metadata.wordCount >= 300 && metadata.wordCount <= 800) {
    score += 2;
  } else if (metadata.wordCount < 300) {
    suggestions.push('Resume content is too brief. Add more detail');
  } else if (metadata.wordCount > 1000) {
    suggestions.push('Resume may be too long. Consider condensing content');
  }
  
  // Check for section completeness
  const sectionsPresent = Object.values(sections).filter(s => s.trim().length > 0).length;
  if (sectionsPresent >= 5) score += 3;
  else if (sectionsPresent >= 3) score += 2;
  else suggestions.push('Add more standard sections for complete ATS parsing');
  
  // Check for problematic characters
  const hasSpecialChars = /[^\x00-\x7F]/.test(fullText);
  if (!hasSpecialChars) score += 2;
  else suggestions.push('Remove special characters that may confuse ATS systems');
  
  return {
    name: 'Formatting & Layout',
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 8 ? 'good' : score >= 5 ? 'warning' : 'error',
    issues,
    suggestions,
  };
}
