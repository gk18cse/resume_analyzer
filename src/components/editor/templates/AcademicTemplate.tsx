import React from 'react';
import { Resume } from '@/types/resume';

interface TemplateProps {
  resume: Resume;
}

/**
 * ATS-Friendly Academic Template
 * 
 * Design Philosophy:
 * - Clean, minimal design suitable for students, researchers, and academics
 * - Emphasizes education, projects, research, and publications
 * - Uses standard fonts (Georgia/Times) for maximum ATS compatibility
 * 
 * Color Palette:
 * - Primary: Navy Blue (#1e3a5f) - Headings
 * - Text: Charcoal (#333333) - Body text
 * - Accent: Slate Gray (#475569) - Dates and secondary info
 * - Background: Pure White (#ffffff)
 * 
 * Typography:
 * - Headings: Georgia, 14-16pt, bold, uppercase
 * - Body: Times New Roman, 11pt
 * - Contact: 10pt
 * 
 * ATS Optimization:
 * - No tables, columns, or graphics
 * - Simple bullet points (standard characters)
 * - Clear section headers
 * - Linear top-to-bottom reading order
 */
const AcademicTemplate = ({ resume }: TemplateProps) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div 
      className="p-10 text-sm leading-relaxed" 
      style={{ fontFamily: 'Times New Roman, Georgia, serif', color: '#333333' }}
    >
      {/* Header - Simple centered name and contact */}
      <header className="text-center mb-6">
        <h1 
          className="text-2xl font-bold tracking-wide mb-3"
          style={{ color: '#1e3a5f', fontFamily: 'Georgia, serif' }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-xs space-y-1" style={{ color: '#475569' }}>
          <p>
            {[personalInfo.email, personalInfo.phone, personalInfo.location]
              .filter(Boolean)
              .join(' | ')}
          </p>
          <p>
            {[personalInfo.linkedin, personalInfo.website]
              .filter(Boolean)
              .join(' | ')}
          </p>
        </div>
      </header>

      {/* Professional Summary / Research Interests */}
      {personalInfo.summary && (
        <section className="mb-5">
          <h2 
            className="text-sm font-bold uppercase tracking-widest pb-1 mb-2"
            style={{ color: '#1e3a5f', borderBottom: '2px solid #1e3a5f' }}
          >
            Research Interests / Summary
          </h2>
          <p className="text-justify leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Education - Emphasized for academics */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-sm font-bold uppercase tracking-widest pb-1 mb-2"
            style={{ color: '#1e3a5f', borderBottom: '2px solid #1e3a5f' }}
          >
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{edu.institution}</h3>
                <span className="text-xs" style={{ color: '#475569' }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="font-semibold">{edu.degree} in {edu.field}</p>
              {edu.gpa && (
                <p className="text-xs" style={{ color: '#475569' }}>
                  GPA: {edu.gpa}
                </p>
              )}
              {edu.description && (
                <p className="mt-1 text-sm">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects / Research */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-sm font-bold uppercase tracking-widest pb-1 mb-2"
            style={{ color: '#1e3a5f', borderBottom: '2px solid #1e3a5f' }}
          >
            Research Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{proj.name}</h3>
                {(proj.startDate || proj.endDate) && (
                  <span className="text-xs" style={{ color: '#475569' }}>
                    {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                  </span>
                )}
              </div>
              <p className="mt-1">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p className="text-xs mt-1" style={{ color: '#475569' }}>
                  Technologies: {proj.technologies.join(', ')}
                </p>
              )}
              {proj.link && (
                <p className="text-xs" style={{ color: '#475569' }}>
                  Link: {proj.link}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-sm font-bold uppercase tracking-widest pb-1 mb-2"
            style={{ color: '#1e3a5f', borderBottom: '2px solid #1e3a5f' }}
          >
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-xs" style={{ color: '#475569' }}>
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="font-medium">{exp.company}{exp.location && `, ${exp.location}`}</p>
              {exp.description && <p className="mt-1">{exp.description}</p>}
              {exp.highlights.filter(h => h).length > 0 && (
                <ul className="mt-2 ml-4">
                  {exp.highlights.filter(h => h).map((highlight, idx) => (
                    <li key={idx} className="mb-1">
                      • {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-sm font-bold uppercase tracking-widest pb-1 mb-2"
            style={{ color: '#1e3a5f', borderBottom: '2px solid #1e3a5f' }}
          >
            Skills
          </h2>
          <p>{skills.map(s => s.name).join(', ')}</p>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-sm font-bold uppercase tracking-widest pb-1 mb-2"
            style={{ color: '#1e3a5f', borderBottom: '2px solid #1e3a5f' }}
          >
            Certifications & Awards
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{cert.name}</span>
                <span className="text-xs" style={{ color: '#475569' }}>
                  {formatDate(cert.date)}
                </span>
              </div>
              <p className="text-sm" style={{ color: '#475569' }}>
                {cert.issuer}
                {cert.credentialId && ` | ID: ${cert.credentialId}`}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default AcademicTemplate;
