import React from 'react';
import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface TemplateProps {
  resume: Resume;
}

const ModernTemplate = ({ resume }: TemplateProps) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSkillWidth = (level: string) => {
    switch (level) {
      case 'beginner': return '25%';
      case 'intermediate': return '50%';
      case 'advanced': return '75%';
      case 'expert': return '100%';
      default: return '50%';
    }
  };

  return (
    <div className="font-sans text-sm" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-blue-600 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {personalInfo.website}
            </span>
          )}
        </div>
      </header>

      <div className="p-8">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-600"></span>
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-600"></span>
              Work Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 pl-4 border-l-2 border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
                {exp.highlights.filter(h => h).length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.filter(h => h).map((highlight, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-600"></span>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 pl-4 border-l-2 border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-blue-600">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-600"></span>
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-gray-500 capitalize text-xs">{skill.level}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: getSkillWidth(skill.level) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-600"></span>
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3 pl-4 border-l-2 border-gray-200">
                <h3 className="font-bold text-gray-900">{proj.name}</h3>
                <p className="text-gray-600 text-sm">{proj.description}</p>
                {proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((tech, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-blue-600"></span>
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2 pl-4 border-l-2 border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-blue-600 text-sm">{cert.issuer}</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {formatDate(cert.date)}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
