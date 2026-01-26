import React from 'react';
import { Resume } from '@/types/resume';

interface TemplateProps {
  resume: Resume;
}

/**
 * ATS-Friendly Executive Template
 * 
 * Design Philosophy:
 * - Elegant, formal design for managers and business professionals
 * - Emphasizes experience, leadership, and achievements
 * - Conservative styling with refined typography
 * 
 * Color Palette:
 * - Primary: Deep Charcoal (#1a1a2e) - Name and key headings
 * - Secondary: Burgundy (#7c2d4b) - Section accents
 * - Text: Dark Gray (#374151) - Body text
 * - Accent: Gold (#b8860b) - Subtle highlights
 * - Background: Pure White (#ffffff)
 * 
 * Typography:
 * - Name: Georgia, 24pt, bold
 * - Headings: Georgia, 12pt, uppercase, letter-spaced
 * - Body: Garamond/Georgia, 11pt
 * 
 * ATS Optimization:
 * - No graphics, tables, or multi-column layouts
 * - Standard fonts and formatting
 * - Clear achievement-focused bullet points
 * - Quantifiable metrics emphasized
 */
const ExecutiveTemplate = ({ resume }: TemplateProps) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div 
      className="p-10 text-sm leading-relaxed" 
      style={{ fontFamily: 'Georgia, Garamond, serif', color: '#374151' }}
    >
      {/* Header - Distinguished and formal */}
      <header className="text-center mb-8 pb-6" style={{ borderBottom: '1px solid #d1d5db' }}>
        <h1 
          className="text-3xl font-bold tracking-wide mb-4"
          style={{ color: '#1a1a2e', letterSpacing: '0.05em' }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-sm" style={{ color: '#6b7280' }}>
          <p>
            {personalInfo.email}
            {personalInfo.phone && ` • ${personalInfo.phone}`}
            {personalInfo.location && ` • ${personalInfo.location}`}
          </p>
          {(personalInfo.linkedin || personalInfo.website) && (
            <p className="mt-1">
              {personalInfo.linkedin}
              {personalInfo.linkedin && personalInfo.website && ' • '}
              {personalInfo.website}
            </p>
          )}
        </div>
      </header>

      {/* Executive Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#7c2d4b', letterSpacing: '0.1em' }}
          >
            Executive Summary
          </h2>
          <p className="text-justify leading-relaxed" style={{ lineHeight: '1.7' }}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Professional Experience - Primary focus */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: '#7c2d4b', letterSpacing: '0.1em' }}
          >
            Professional Experience
          </h2>
          {experience.map((exp, index) => (
            <div 
              key={exp.id} 
              className={`${index > 0 ? 'mt-5 pt-4' : ''}`}
              style={{ borderTop: index > 0 ? '1px solid #e5e7eb' : 'none' }}
            >
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold" style={{ color: '#1a1a2e' }}>
                  {exp.position}
                </h3>
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="font-medium mb-2" style={{ color: '#4b5563' }}>
                {exp.company}{exp.location && ` | ${exp.location}`}
              </p>
              {exp.description && (
                <p className="mb-2 italic" style={{ color: '#6b7280' }}>
                  {exp.description}
                </p>
              )}
              {exp.highlights.filter(h => h).length > 0 && (
                <div className="mt-2">
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#7c2d4b' }}>
                    Key Achievements:
                  </p>
                  <ul className="space-y-1 ml-4">
                    {exp.highlights.filter(h => h).map((highlight, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">—</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Core Competencies / Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#7c2d4b', letterSpacing: '0.1em' }}
          >
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {skills.map((skill, index) => (
              <span key={skill.id} className="flex items-center">
                <span 
                  className="w-1.5 h-1.5 rounded-full mr-2"
                  style={{ backgroundColor: '#7c2d4b' }}
                />
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#7c2d4b', letterSpacing: '0.1em' }}
          >
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold" style={{ color: '#1a1a2e' }}>
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={{ color: '#4b5563' }}>{edu.institution}</p>
              {edu.gpa && (
                <p className="text-xs" style={{ color: '#6b7280' }}>GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Key Projects / Initiatives */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#7c2d4b', letterSpacing: '0.1em' }}
          >
            Key Initiatives
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h3 className="font-bold" style={{ color: '#1a1a2e' }}>{proj.name}</h3>
              <p className="mt-1">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                  Scope: {proj.technologies.join(' • ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications & Professional Development */}
      {certifications.length > 0 && (
        <section>
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: '#7c2d4b', letterSpacing: '0.1em' }}
          >
            Professional Development
          </h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold">{cert.name}</span>
                  <span className="mx-2" style={{ color: '#9ca3af' }}>|</span>
                  <span style={{ color: '#6b7280' }}>{cert.issuer}</span>
                </div>
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {formatDate(cert.date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
