import React, { useState } from 'react';
import { Resume, PersonalInfo, Education, Experience, Skill, Project, Certification, ACTION_WORDS, SKILL_KEYWORDS } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, Lightbulb, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface EditorFormProps {
  resume: Resume;
  onUpdate: (resume: Resume) => void;
}

const EditorForm = ({ resume, onUpdate }: EditorFormProps) => {
  const [showActionWords, setShowActionWords] = useState(false);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    onUpdate({
      ...resume,
      personalInfo: { ...resume.personalInfo, [field]: value },
    });
  };

  // Education handlers
  const addEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    };
    onUpdate({ ...resume, education: [...resume.education, newEducation] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onUpdate({
      ...resume,
      education: resume.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const deleteEducation = (id: string) => {
    onUpdate({ ...resume, education: resume.education.filter(edu => edu.id !== id) });
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience: Experience = {
      id: uuidv4(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [''],
    };
    onUpdate({ ...resume, experience: [...resume.experience, newExperience] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onUpdate({
      ...resume,
      experience: resume.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const deleteExperience = (id: string) => {
    onUpdate({ ...resume, experience: resume.experience.filter(exp => exp.id !== id) });
  };

  const addHighlight = (expId: string) => {
    onUpdate({
      ...resume,
      experience: resume.experience.map(exp =>
        exp.id === expId ? { ...exp, highlights: [...exp.highlights, ''] } : exp
      ),
    });
  };

  const updateHighlight = (expId: string, index: number, value: string) => {
    onUpdate({
      ...resume,
      experience: resume.experience.map(exp =>
        exp.id === expId
          ? { ...exp, highlights: exp.highlights.map((h, i) => (i === index ? value : h)) }
          : exp
      ),
    });
  };

  const deleteHighlight = (expId: string, index: number) => {
    onUpdate({
      ...resume,
      experience: resume.experience.map(exp =>
        exp.id === expId
          ? { ...exp, highlights: exp.highlights.filter((_, i) => i !== index) }
          : exp
      ),
    });
  };

  // Skills handlers
  const addSkill = (name: string = '') => {
    const newSkill: Skill = {
      id: uuidv4(),
      name,
      level: 'intermediate',
    };
    onUpdate({ ...resume, skills: [...resume.skills, newSkill] });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    onUpdate({
      ...resume,
      skills: resume.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const deleteSkill = (id: string) => {
    onUpdate({ ...resume, skills: resume.skills.filter(skill => skill.id !== id) });
  };

  // Projects handlers
  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: '',
    };
    onUpdate({ ...resume, projects: [...resume.projects, newProject] });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onUpdate({
      ...resume,
      projects: resume.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const deleteProject = (id: string) => {
    onUpdate({ ...resume, projects: resume.projects.filter(proj => proj.id !== id) });
  };

  // Certifications handlers
  const addCertification = () => {
    const newCertification: Certification = {
      id: uuidv4(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      link: '',
    };
    onUpdate({ ...resume, certifications: [...resume.certifications, newCertification] });
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onUpdate({
      ...resume,
      certifications: resume.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const deleteCertification = (id: string) => {
    onUpdate({ ...resume, certifications: resume.certifications.filter(cert => cert.id !== id) });
  };

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={['personal', 'experience']} className="space-y-3">
        {/* Personal Information */}
        <AccordionItem value="personal" className="bg-card rounded-xl border shadow-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-semibold">Personal Information</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={resume.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={resume.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={resume.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={resume.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={resume.personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="johndoe.com"
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label>Professional Summary</Label>
                <Textarea
                  value={resume.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  placeholder="A brief summary of your professional background and career goals..."
                  rows={4}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience */}
        <AccordionItem value="experience" className="bg-card rounded-xl border shadow-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-semibold">Work Experience</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {/* Action words suggestion */}
            <button
              onClick={() => setShowActionWords(!showActionWords)}
              className="flex items-center gap-2 text-sm text-primary mb-4 hover:underline"
            >
              <Lightbulb className="w-4 h-4" />
              {showActionWords ? 'Hide' : 'Show'} action word suggestions
            </button>
            {showActionWords && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Use these action words to strengthen your descriptions:</p>
                <div className="flex flex-wrap gap-1">
                  {ACTION_WORDS.map((word) => (
                    <Badge key={word} variant="secondary" className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {resume.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Experience {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteExperience(exp.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <Checkbox
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-sm">
                        I currently work here
                      </label>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Brief description of your role..."
                        rows={2}
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label>Key Achievements</Label>
                      {exp.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) => updateHighlight(exp.id, hIndex, e.target.value)}
                            placeholder="Start with an action verb..."
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHighlight(exp.id, hIndex)}
                            className="shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addHighlight(exp.id)}
                        className="mt-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Achievement
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addExperience} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="bg-card rounded-xl border shadow-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-semibold">Education</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {resume.education.map((edu, index) => (
                <div key={edu.id} className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Education {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEducation(edu.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="University name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GPA (optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        placeholder="e.g., 3.8"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addEducation} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="bg-card rounded-xl border shadow-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-semibold">Skills</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {/* Skill suggestions */}
            <button
              onClick={() => setShowSkillSuggestions(!showSkillSuggestions)}
              className="flex items-center gap-2 text-sm text-primary mb-4 hover:underline"
            >
              <Lightbulb className="w-4 h-4" />
              {showSkillSuggestions ? 'Hide' : 'Show'} skill suggestions
            </button>
            {showSkillSuggestions && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Click to add popular skills:</p>
                <div className="flex flex-wrap gap-1">
                  {SKILL_KEYWORDS.filter(
                    skill => !resume.skills.find(s => s.name.toLowerCase() === skill.toLowerCase())
                  ).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {resume.skills.map((skill, index) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    placeholder="Skill name"
                    className="flex-1"
                  />
                  <Select
                    value={skill.level}
                    onValueChange={(value) => updateSkill(skill.id, 'level', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSkill(skill.id)}
                    className="shrink-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" onClick={() => addSkill()} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects" className="bg-card rounded-xl border shadow-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-semibold">Projects</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {resume.projects.map((proj, index) => (
                <div key={proj.id} className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Project {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProject(proj.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                        placeholder="Project name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link</Label>
                      <Input
                        value={proj.link}
                        onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="Describe the project..."
                        rows={2}
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label>Technologies (comma-separated)</Label>
                      <Input
                        value={proj.technologies.join(', ')}
                        onChange={(e) => updateProject(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addProject} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications" className="bg-card rounded-xl border shadow-card">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="font-semibold">Certifications</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {resume.certifications.map((cert, index) => (
                <div key={cert.id} className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">Certification {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCertification(cert.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Certification Name</Label>
                      <Input
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                        placeholder="Certification name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Issuing Organization</Label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                        placeholder="e.g., AWS, Google"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Issue Date</Label>
                      <Input
                        type="month"
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Credential ID</Label>
                      <Input
                        value={cert.credentialId}
                        onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addCertification} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EditorForm;
