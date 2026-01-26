import React from 'react';
import { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Star } from 'lucide-react';

interface TemplateProps {
  resume: Resume;
}

const CreativeTemplate = ({ resume }: TemplateProps) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSkillStars = (level: string) => {
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    return levels[level as keyof typeof levels] || 2;
  };

  return (
    <div className="font-sans text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/3 bg-gradient-to-b from-rose-500 to-pink-600 text-white p-6 min-h-full">
          <div className="mb-6">
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
              {personalInfo.fullName?.split(' ').map(n => n[0]).join('') || 'YN'}
            </div>
            <h1 className="text-xl font-bold text-center">
              {personalInfo.fullName || 'Your Name'}
            </h1>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-white/30 pb-2">
              Contact
            </h2>
            <div className="space-y-2 text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span className="break-all">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="break-all">{personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-white/30 pb-2">
                Skills
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <span className="text-sm">{skill.name}</span>
                    <div className="flex gap-1 mt-1">
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < getSkillStars(skill.level) ? 'fill-white' : 'fill-white/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b border-white/30 pb-2">
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <p className="text-white/80 text-sm">{edu.field}</p>
                  <p className="text-white/80 text-xs">{edu.institution}</p>
                  <p className="text-white/60 text-xs">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-rose-500 mb-2 uppercase tracking-wider">
                Profile
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-rose-500 mb-3 uppercase tracking-wider">
                Experience
              </h2>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4 relative pl-4 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-rose-500 before:rounded-full">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-rose-500 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-rose-50 px-2 py-1 rounded-full">
                      {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                  {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
                  {exp.highlights.filter(h => h).length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.filter(h => h).map((highlight, idx) => (
                        <li key={idx} className="text-gray-700 flex items-start gap-2 text-sm">
                          <span className="text-rose-500">→</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-rose-500 mb-3 uppercase tracking-wider">
                Projects
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-rose-50 rounded-lg">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    <p className="text-gray-600 text-sm">{proj.description}</p>
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((tech, idx) => (
                          <span key={idx} className="text-xs bg-white text-rose-600 px-2 py-0.5 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-rose-500 mb-3 uppercase tracking-wider">
                Certifications
              </h2>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="px-3 py-2 bg-rose-50 rounded-lg">
                    <h3 className="font-bold text-sm text-gray-900">{cert.name}</h3>
                    <p className="text-rose-500 text-xs">{cert.issuer} • {formatDate(cert.date)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default CreativeTemplate;
