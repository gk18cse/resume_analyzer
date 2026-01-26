import React from 'react';
import { Resume } from '@/types/resume';

interface TemplateProps {
  resume: Resume;
}

/**
 * ATS-Friendly Technical Template
 * 
 * Design Philosophy:
 * - Modern, professional design for developers and engineers
 * - Highlights skills, programming languages, tools, and technical projects
 * - Clean monospace accents for technical feel
 * 
 * Color Palette:
 * - Primary: Teal (#0d9488) - Section headers and accents
 * - Text: Dark Gray (#1f2937) - Body text
 * - Secondary: Medium Gray (#4b5563) - Dates and metadata
 * - Background: Pure White (#ffffff)
 * 
 * Typography:
 * - Headings: Inter/Arial, 12-14pt, bold, uppercase
 * - Body: Arial/Helvetica, 10-11pt
 * - Skills: Slightly condensed for compact display
 * 
 * ATS Optimization:
 * - No tables, icons, or complex layouts
 * - Skills listed in comma-separated format
 * - Standard bullet characters
 * - Clear keyword-rich headings
 */
const TechnicalTemplate = ({ resume }: TemplateProps) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Group skills by level for better organization
  const skillsByLevel = {
    expert: skills.filter(s => s.level === 'expert'),
    advanced: skills.filter(s => s.level === 'advanced'),
    intermediate: skills.filter(s => s.level === 'intermediate'),
    beginner: skills.filter(s => s.level === 'beginner'),
  };

  return (
    <div 
      className="p-8 text-sm" 
      style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#1f2937' }}
    >
      {/* Header */}
      <header className="mb-6 pb-4" style={{ borderBottom: '3px solid #0d9488' }}>
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: '#0d9488' }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-sm space-y-1" style={{ color: '#4b5563' }}>
          <p>
            {personalInfo.email}
            {personalInfo.phone && ` | ${personalInfo.phone}`}
            {personalInfo.location && ` | ${personalInfo.location}`}
          </p>
          <p>
            {personalInfo.linkedin}
            {personalInfo.website && ` | ${personalInfo.website}`}
          </p>
        </div>
      </header>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: '#0d9488' }}
          >
            Professional Summary
          </h2>
          <p className="leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Technical Skills - Prominent placement */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: '#0d9488' }}
          >
            Technical Skills
          </h2>
          <div className="space-y-1">
            {skillsByLevel.expert.length > 0 && (
              <p>
                <span className="font-semibold">Expert: </span>
                {skillsByLevel.expert.map(s => s.name).join(', ')}
              </p>
            )}
            {skillsByLevel.advanced.length > 0 && (
              <p>
                <span className="font-semibold">Advanced: </span>
                {skillsByLevel.advanced.map(s => s.name).join(', ')}
              </p>
            )}
            {skillsByLevel.intermediate.length > 0 && (
              <p>
                <span className="font-semibold">Intermediate: </span>
                {skillsByLevel.intermediate.map(s => s.name).join(', ')}
              </p>
            )}
            {skillsByLevel.beginner.length > 0 && (
              <p>
                <span className="font-semibold">Familiar: </span>
                {skillsByLevel.beginner.map(s => s.name).join(', ')}
              </p>
            )}
            {/* Fallback if no levels are set */}
            {!skillsByLevel.expert.length && !skillsByLevel.advanced.length && 
             !skillsByLevel.intermediate.length && !skillsByLevel.beginner.length && (
              <p>{skills.map(s => s.name).join(', ')}</p>
            )}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#0d9488' }}
          >
            Professional Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base">{exp.position}</h3>
                  <p className="font-medium" style={{ color: '#4b5563' }}>
                    {exp.company}{exp.location && ` — ${exp.location}`}
                  </p>
                </div>
                <span 
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{ backgroundColor: '#f0fdfa', color: '#0d9488' }}
                >
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && <p className="mt-2">{exp.description}</p>}
              {exp.highlights.filter(h => h).length > 0 && (
                <ul className="mt-2 space-y-1">
                  {exp.highlights.filter(h => h).map((highlight, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2" style={{ color: '#0d9488' }}>▸</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Technical Projects */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#0d9488' }}
          >
            Technical Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">
                  {proj.name}
                  {proj.link && (
                    <span className="font-normal text-xs ml-2" style={{ color: '#4b5563' }}>
                      ({proj.link})
                    </span>
                  )}
                </h3>
              </div>
              <p className="mt-1">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p className="text-xs mt-1">
                  <span className="font-semibold" style={{ color: '#0d9488' }}>Tech Stack: </span>
                  {proj.technologies.join(' | ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: '#0d9488' }}
          >
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{edu.degree} in {edu.field}</span>
                  <span className="mx-2">—</span>
                  <span>{edu.institution}</span>
                </div>
                <span className="text-xs" style={{ color: '#4b5563' }}>
                  {formatDate(edu.endDate)}
                </span>
              </div>
              {edu.gpa && (
                <p className="text-xs" style={{ color: '#4b5563' }}>GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: '#0d9488' }}
          >
            Certifications
          </h2>
          <ul className="space-y-1">
            {certifications.map((cert) => (
              <li key={cert.id} className="flex items-start">
                <span className="mr-2" style={{ color: '#0d9488' }}>▸</span>
                <span>
                  <span className="font-semibold">{cert.name}</span>
                  <span className="mx-1">—</span>
                  <span style={{ color: '#4b5563' }}>{cert.issuer}</span>
                  <span className="text-xs ml-2" style={{ color: '#6b7280' }}>
                    ({formatDate(cert.date)})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default TechnicalTemplate;
