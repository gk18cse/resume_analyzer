import React from 'react';
import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface TemplateProps {
  resume: Resume;
}

const MinimalistTemplate = ({ resume }: TemplateProps) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8 font-sans text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <header className="text-center mb-6 border-b-2 border-gray-900 pb-4">
        <h1 className="text-3xl font-bold tracking-wide uppercase mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-700">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-5">
          <p className="text-gray-700 text-center italic">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{exp.position}</h3>
                <span className="text-xs text-gray-600">
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-gray-700 italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
              {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
              {exp.highlights.filter(h => h).length > 0 && (
                <ul className="list-disc list-inside mt-1 text-gray-700">
                  {exp.highlights.filter(h => h).map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                <span className="text-xs text-gray-600">
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-gray-700 italic">{edu.institution}</p>
              {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-gray-700">
                {skill.name}{skills.indexOf(skill) < skills.length - 1 ? ' •' : ''}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h3 className="font-bold">{proj.name}</h3>
              <p className="text-gray-600">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Technologies: {proj.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-3">
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{cert.name}</h3>
                <span className="text-xs text-gray-600">{formatDate(cert.date)}</span>
              </div>
              <p className="text-gray-700 italic">{cert.issuer}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default MinimalistTemplate;
