import React from 'react';
import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface TemplateProps {
  resume: Resume;
}

const ProfessionalTemplate = ({ resume }: TemplateProps) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="font-sans text-sm" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Header */}
      <header className="bg-slate-800 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.summary && (
              <p className="text-slate-300 mt-2 max-w-lg text-sm leading-relaxed">
                {personalInfo.summary}
              </p>
            )}
          </div>
          <div className="text-right text-sm space-y-1">
            {personalInfo.email && (
              <div className="flex items-center gap-2 justify-end">
                <span>{personalInfo.email}</span>
                <Mail className="w-4 h-4" />
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 justify-end">
                <span>{personalInfo.phone}</span>
                <Phone className="w-4 h-4" />
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2 justify-end">
                <span>{personalInfo.location}</span>
                <MapPin className="w-4 h-4" />
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2 justify-end">
                <span>{personalInfo.linkedin}</span>
                <Linkedin className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b-2 border-slate-800 pb-1 mb-3">
              Professional Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={exp.id} className={`${index > 0 ? 'mt-4' : ''}`}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900">{exp.position}</h3>
                  <span className="text-sm text-slate-600">
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">
                  {exp.company}{exp.location && ` | ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="text-slate-600 mt-1 text-sm">{exp.description}</p>
                )}
                {exp.highlights.filter(h => h).length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.filter(h => h).map((highlight, idx) => (
                      <li key={idx} className="text-slate-700 flex items-start gap-2 text-sm">
                        <span className="text-slate-400">■</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b-2 border-slate-800 pb-1 mb-3">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-slate-700">{edu.field}</p>
                  <p className="text-slate-600 text-sm">{edu.institution}</p>
                  <p className="text-slate-500 text-xs">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b-2 border-slate-800 pb-1 mb-3">
                Core Competencies
              </h2>
              <div className="grid grid-cols-2 gap-1">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                    <span className="text-slate-700">{skill.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mt-5">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b-2 border-slate-800 pb-1 mb-3">
              Key Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <h3 className="font-bold text-slate-900">{proj.name}</h3>
                <p className="text-slate-600 text-sm">{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-medium">Technologies:</span> {proj.technologies.join(' • ')}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mt-5">
            <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b-2 border-slate-800 pb-1 mb-3">
              Certifications & Licenses
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5"></span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{cert.name}</h3>
                    <p className="text-xs text-slate-600">{cert.issuer} • {formatDate(cert.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
