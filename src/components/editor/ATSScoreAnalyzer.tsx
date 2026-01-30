import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  TrendingUp, 
  Lightbulb,
  FileCheck,
  Hash,
  Type,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Resume, ACTION_WORDS, SKILL_KEYWORDS } from '@/types/resume';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface ATSScoreAnalyzerProps {
  resume: Resume;
}

interface AnalysisResult {
  category: string;
  icon: React.ReactNode;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'error';
  issues: string[];
  suggestions: string[];
}

const ATSScoreAnalyzer = ({ resume }: ATSScoreAnalyzerProps) => {
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['overview']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const analysis = useMemo(() => {
    const results: AnalysisResult[] = [];

    // 1. Contact Information Analysis
    const contactScore = analyzeContact(resume);
    results.push(contactScore);

    // 2. Professional Summary Analysis
    const summaryScore = analyzeSummary(resume);
    results.push(summaryScore);

    // 3. Experience Analysis
    const experienceScore = analyzeExperience(resume);
    results.push(experienceScore);

    // 4. Skills Analysis
    const skillsScore = analyzeSkills(resume);
    results.push(skillsScore);

    // 5. Education Analysis
    const educationScore = analyzeEducation(resume);
    results.push(educationScore);

    // 6. Keywords Analysis
    const keywordsScore = analyzeKeywords(resume);
    results.push(keywordsScore);

    // 7. Formatting Analysis
    const formattingScore = analyzeFormatting(resume);
    results.push(formattingScore);

    return results;
  }, [resume]);

  const totalScore = useMemo(() => {
    const total = analysis.reduce((acc, item) => acc + item.score, 0);
    const maxTotal = analysis.reduce((acc, item) => acc + item.maxScore, 0);
    return Math.round((total / maxTotal) * 100);
  }, [analysis]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 70) return 'from-yellow-500 to-amber-500';
    if (score >= 50) return 'from-orange-500 to-amber-600';
    return 'from-red-500 to-rose-500';
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileCheck className="w-5 h-5 text-primary" />
          ATS Score Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <Collapsible 
          open={expandedSections.includes('overview')}
          onOpenChange={() => toggleSection('overview')}
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br text-white font-bold text-xl",
                  getScoreGradient(totalScore)
                )}>
                  {totalScore}
                </div>
                <div className="text-left">
                  <p className="font-semibold">Overall ATS Score</p>
                  <p className="text-sm text-muted-foreground">
                    {totalScore >= 90 ? 'Excellent! Ready to apply' : 
                     totalScore >= 70 ? 'Good, minor improvements needed' :
                     totalScore >= 50 ? 'Fair, several areas need work' :
                     'Needs significant improvement'}
                  </p>
                </div>
              </div>
              {expandedSections.includes('overview') ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3 space-y-2">
              {analysis.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {getStatusIcon(item.status)}
                  <span className="flex-1">{item.category}</span>
                  <span className={cn("font-medium", 
                    item.status === 'good' ? 'text-green-600' :
                    item.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  )}>
                    {item.score}/{item.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Detailed Analysis */}
        {analysis.map((item, index) => (
          <Collapsible 
            key={index}
            open={expandedSections.includes(item.category)}
            onOpenChange={() => toggleSection(item.category)}
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="font-medium text-sm">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <Badge variant={
                    item.status === 'good' ? 'default' :
                    item.status === 'warning' ? 'secondary' : 'destructive'
                  } className="text-xs">
                    {Math.round((item.score / item.maxScore) * 100)}%
                  </Badge>
                  {expandedSections.includes(item.category) ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-7 pr-2 pb-2 space-y-2"
                >
                  {item.issues.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Issues Found
                      </p>
                      {item.issues.map((issue, i) => (
                        <p key={i} className="text-xs text-muted-foreground pl-4">• {issue}</p>
                      ))}
                    </div>
                  )}
                  {item.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-blue-600 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> Suggestions
                      </p>
                      {item.suggestions.map((suggestion, i) => (
                        <p key={i} className="text-xs text-muted-foreground pl-4">• {suggestion}</p>
                      ))}
                    </div>
                  )}
                  {item.issues.length === 0 && item.suggestions.length === 0 && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Looking great! No improvements needed.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
};

// Analysis Functions
function analyzeContact(resume: Resume): AnalysisResult {
  const { personalInfo } = resume;
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 15;

  if (personalInfo.fullName) score += 3;
  else issues.push('Full name is missing');

  if (personalInfo.email) {
    score += 3;
    if (!personalInfo.email.includes('@')) issues.push('Email format appears invalid');
  } else issues.push('Email address is missing');

  if (personalInfo.phone) score += 3;
  else issues.push('Phone number is missing');

  if (personalInfo.location) score += 3;
  else suggestions.push('Consider adding your location');

  if (personalInfo.linkedin) score += 2;
  else suggestions.push('Adding LinkedIn profile can increase visibility');

  if (personalInfo.website) score += 1;

  return {
    category: 'Contact Information',
    icon: <Type className="w-4 h-4 text-blue-500" />,
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 12 ? 'good' : score >= 8 ? 'warning' : 'error',
    issues,
    suggestions
  };
}

function analyzeSummary(resume: Resume): AnalysisResult {
  const { personalInfo } = resume;
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 15;

  const summary = personalInfo.summary || '';
  const wordCount = summary.split(/\s+/).filter(Boolean).length;

  if (summary) {
    score += 5;
    
    if (wordCount >= 30 && wordCount <= 100) {
      score += 5;
    } else if (wordCount < 30) {
      suggestions.push('Summary is too short. Aim for 30-100 words.');
    } else {
      suggestions.push('Summary is too long. Keep it under 100 words.');
    }

    // Check for action words
    const hasActionWords = ACTION_WORDS.some(word => 
      summary.toLowerCase().includes(word.toLowerCase())
    );
    if (hasActionWords) score += 3;
    else suggestions.push('Include action words like "Developed", "Led", "Achieved"');

    // Check for quantifiable achievements
    const hasNumbers = /\d+/.test(summary);
    if (hasNumbers) score += 2;
    else suggestions.push('Add quantifiable achievements (e.g., "increased sales by 25%")');

  } else {
    issues.push('Professional summary is missing');
    suggestions.push('Add a 2-4 sentence summary highlighting your key qualifications');
  }

  return {
    category: 'Professional Summary',
    icon: <ListChecks className="w-4 h-4 text-purple-500" />,
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 12 ? 'good' : score >= 8 ? 'warning' : 'error',
    issues,
    suggestions
  };
}

function analyzeExperience(resume: Resume): AnalysisResult {
  const { experience } = resume;
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 25;

  if (experience.length === 0) {
    issues.push('No work experience added');
    suggestions.push('Add at least one work experience entry');
    return {
      category: 'Work Experience',
      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
      score: 0,
      maxScore,
      status: 'error',
      issues,
      suggestions
    };
  }

  score += Math.min(experience.length * 5, 15);

  let hasActionWords = false;
  let hasQuantifiables = false;
  let hasDetailedDescriptions = false;

  experience.forEach((exp, index) => {
    if (!exp.company) issues.push(`Experience ${index + 1}: Company name missing`);
    if (!exp.position) issues.push(`Experience ${index + 1}: Job title missing`);
    
    const description = exp.description || '';
    const highlights = exp.highlights || [];
    const allText = description + ' ' + highlights.join(' ');
    
    if (ACTION_WORDS.some(word => allText.toLowerCase().includes(word.toLowerCase()))) {
      hasActionWords = true;
    }
    
    if (/\d+%?/.test(allText)) {
      hasQuantifiables = true;
    }
    
    if (description.length > 50 || highlights.length >= 2) {
      hasDetailedDescriptions = true;
    }
  });

  if (hasActionWords) score += 4;
  else suggestions.push('Use action verbs like "Managed", "Developed", "Increased"');

  if (hasQuantifiables) score += 3;
  else suggestions.push('Add metrics and numbers (e.g., "managed team of 5", "increased efficiency by 30%")');

  if (hasDetailedDescriptions) score += 3;
  else suggestions.push('Add detailed descriptions with 2-4 bullet points per role');

  return {
    category: 'Work Experience',
    icon: <TrendingUp className="w-4 h-4 text-green-500" />,
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 20 ? 'good' : score >= 12 ? 'warning' : 'error',
    issues,
    suggestions
  };
}

function analyzeSkills(resume: Resume): AnalysisResult {
  const { skills } = resume;
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 15;

  if (skills.length === 0) {
    issues.push('No skills added');
    suggestions.push('Add at least 5-10 relevant skills');
    return {
      category: 'Skills',
      icon: <Hash className="w-4 h-4 text-orange-500" />,
      score: 0,
      maxScore,
      status: 'error',
      issues,
      suggestions
    };
  }

  // Score based on number of skills
  if (skills.length >= 10) score += 8;
  else if (skills.length >= 5) score += 5;
  else score += 2;

  // Check for industry keywords
  const skillNames = skills.map(s => s.name.toLowerCase());
  const matchingKeywords = SKILL_KEYWORDS.filter(keyword => 
    skillNames.some(skill => skill.includes(keyword.toLowerCase()))
  );

  if (matchingKeywords.length >= 5) score += 5;
  else if (matchingKeywords.length >= 2) score += 3;
  
  if (matchingKeywords.length < 3) {
    suggestions.push('Include more industry-standard keywords like: ' + 
      SKILL_KEYWORDS.slice(0, 5).join(', '));
  }

  // Check skill variety
  const expertSkills = skills.filter(s => s.level === 'expert').length;
  const advancedSkills = skills.filter(s => s.level === 'advanced').length;
  
  if (expertSkills > 0 || advancedSkills > 0) score += 2;
  else suggestions.push('Mark your strongest skills as "Advanced" or "Expert"');

  return {
    category: 'Skills',
    icon: <Hash className="w-4 h-4 text-orange-500" />,
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 12 ? 'good' : score >= 8 ? 'warning' : 'error',
    issues,
    suggestions
  };
}

function analyzeEducation(resume: Resume): AnalysisResult {
  const { education } = resume;
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 10;

  if (education.length === 0) {
    issues.push('No education entries added');
    suggestions.push('Add your educational background');
    return {
      category: 'Education',
      icon: <FileCheck className="w-4 h-4 text-indigo-500" />,
      score: 0,
      maxScore,
      status: 'error',
      issues,
      suggestions
    };
  }

  score += Math.min(education.length * 4, 8);

  education.forEach((edu, index) => {
    if (!edu.institution) issues.push(`Education ${index + 1}: Institution name missing`);
    if (!edu.degree) issues.push(`Education ${index + 1}: Degree missing`);
    if (edu.gpa) score += 1;
  });

  if (!education.some(e => e.gpa)) {
    suggestions.push('Consider adding GPA if it\'s 3.0 or higher');
  }

  return {
    category: 'Education',
    icon: <FileCheck className="w-4 h-4 text-indigo-500" />,
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 8 ? 'good' : score >= 5 ? 'warning' : 'error',
    issues,
    suggestions
  };
}

function analyzeKeywords(resume: Resume): AnalysisResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 10;

  // Collect all text
  const allText = [
    resume.personalInfo.summary,
    ...resume.experience.map(e => e.description + ' ' + e.highlights.join(' ')),
    ...resume.skills.map(s => s.name),
    ...resume.projects.map(p => p.description + ' ' + p.technologies.join(' ')),
  ].join(' ').toLowerCase();

  // Count action words
  const actionWordCount = ACTION_WORDS.filter(word => 
    allText.includes(word.toLowerCase())
  ).length;

  if (actionWordCount >= 10) score += 5;
  else if (actionWordCount >= 5) score += 3;
  else if (actionWordCount >= 2) score += 1;

  if (actionWordCount < 5) {
    suggestions.push(`Use more action words. Found ${actionWordCount}, aim for 10+`);
  }

  // Count skill keywords
  const skillKeywordCount = SKILL_KEYWORDS.filter(word => 
    allText.includes(word.toLowerCase())
  ).length;

  if (skillKeywordCount >= 8) score += 5;
  else if (skillKeywordCount >= 4) score += 3;
  else if (skillKeywordCount >= 2) score += 1;

  if (skillKeywordCount < 5) {
    suggestions.push(`Include more industry keywords. Found ${skillKeywordCount}, aim for 8+`);
  }

  return {
    category: 'Keyword Optimization',
    icon: <Sparkles className="w-4 h-4 text-yellow-500" />,
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 8 ? 'good' : score >= 5 ? 'warning' : 'error',
    issues,
    suggestions
  };
}

function analyzeFormatting(resume: Resume): AnalysisResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 10;

  // Check for ATS-friendly template
  const atsTemplates = ['minimalist', 'professional', 'academic', 'technical', 'executive'];
  if (atsTemplates.includes(resume.template)) {
    score += 4;
  } else {
    suggestions.push('Consider using an ATS-friendly template for better compatibility');
  }

  // Check section completeness
  const sectionsComplete = [
    resume.personalInfo.fullName,
    resume.personalInfo.email,
    resume.personalInfo.summary,
    resume.experience.length > 0,
    resume.education.length > 0,
    resume.skills.length > 0,
  ].filter(Boolean).length;

  score += Math.floor((sectionsComplete / 6) * 4);

  if (sectionsComplete < 6) {
    suggestions.push('Complete all major sections for best results');
  }

  // Check for consistent date formats
  const hasExperienceDates = resume.experience.every(e => e.startDate);
  const hasEducationDates = resume.education.every(e => e.startDate);
  
  if (hasExperienceDates && hasEducationDates) {
    score += 2;
  } else {
    suggestions.push('Ensure all entries have dates for ATS parsing');
  }

  return {
    category: 'Formatting & Structure',
    icon: <Type className="w-4 h-4 text-cyan-500" />,
    score: Math.min(score, maxScore),
    maxScore,
    status: score >= 8 ? 'good' : score >= 5 ? 'warning' : 'error',
    issues,
    suggestions
  };
}

export default ATSScoreAnalyzer;
