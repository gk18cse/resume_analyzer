export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  credentialId: string;
  link: string;
}

export type TemplateType = 'minimalist' | 'modern' | 'creative' | 'professional';

export interface Resume {
  id: string;
  name: string;
  template: TemplateType;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const ACTION_WORDS = [
  'Achieved', 'Administered', 'Analyzed', 'Collaborated', 'Coordinated',
  'Created', 'Delivered', 'Designed', 'Developed', 'Directed',
  'Enhanced', 'Established', 'Executed', 'Generated', 'Implemented',
  'Improved', 'Increased', 'Initiated', 'Innovated', 'Led',
  'Managed', 'Mentored', 'Negotiated', 'Optimized', 'Orchestrated',
  'Pioneered', 'Produced', 'Reduced', 'Resolved', 'Spearheaded',
  'Streamlined', 'Supervised', 'Transformed', 'Upgraded'
];

export const SKILL_KEYWORDS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'Java', 'C++', 'SQL', 'MongoDB', 'AWS',
  'Git', 'Docker', 'Kubernetes', 'REST API', 'GraphQL',
  'Machine Learning', 'Data Analysis', 'Agile', 'Scrum', 'Leadership',
  'Communication', 'Problem Solving', 'Team Management', 'Project Management'
];

export const createEmptyResume = (id: string, name: string = 'Untitled Resume'): Resume => ({
  id,
  name,
  template: 'modern',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
