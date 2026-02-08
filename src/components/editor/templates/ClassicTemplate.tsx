import React from 'react';
import { Resume } from '@/types/resume';

interface TemplateProps {
  resume: Resume;
}

const ClassicTemplate = ({ resume }: TemplateProps) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const contactParts = [
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.website,
  ].filter(Boolean);

  return (
    <div
      className="classic-resume"
      style={{
        fontFamily: "'Times New Roman', 'Georgia', 'Garamond', serif",
        fontSize: '10.5pt',
        lineHeight: '1.35',
        color: '#000',
        padding: '14mm 20mm 12mm 20mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Header - Centered Name */}
      <div style={{ textAlign: 'center', marginBottom: '1pt' }}>
        <h1
          style={{
            fontSize: '22pt',
            fontWeight: 700,
            letterSpacing: '1.5px',
            margin: 0,
            lineHeight: 1.15,
            color: '#000',
          }}
        >
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
      </div>

      {/* Contact Info - Centered, separated by · with underlines on links */}
      {contactParts.length > 0 && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '9.5pt',
            color: '#000',
            marginBottom: '6pt',
            lineHeight: 1.5,
          }}
        >
          {contactParts.map((part, idx) => (
            <span key={idx}>
              {idx > 0 && <span style={{ margin: '0 5pt' }}>·</span>}
              <span
                style={{
                  textDecoration:
                    part.includes('@') ||
                    part.includes('.com') ||
                    part.includes('linkedin') ||
                    part.includes('github')
                      ? 'underline'
                      : 'none',
                }}
              >
                {part}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* SUMMARY */}
      {personalInfo.summary && (
        <section style={{ marginBottom: '6pt' }}>
          <SectionHeader title="SUMMARY" />
          <p
            style={{
              fontSize: '10pt',
              lineHeight: 1.4,
              color: '#000',
              margin: 0,
              textAlign: 'justify',
            }}
          >
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <section style={{ marginBottom: '6pt' }}>
          <SectionHeader title="EDUCATION" />
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '3pt' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '10.5pt' }}>
                    {edu.institution}
                  </span>
                </div>
                <span style={{ textAlign: 'right', fontSize: '10pt', whiteSpace: 'nowrap', color: '#000', fontStyle: 'italic' }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontStyle: 'italic', fontSize: '10pt', color: '#000' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </span>
                {edu.gpa && (
                  <span style={{ fontSize: '10pt', fontStyle: 'italic', color: '#000', whiteSpace: 'nowrap' }}>
                    CGPA: {edu.gpa}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* INTERNSHIP/TRAINING */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '6pt' }}>
          <SectionHeader title="INTERNSHIP/TRAINING" />
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '6pt' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 700, fontSize: '10.5pt' }}>
                  {exp.position}
                </span>
                <span style={{ fontSize: '10pt', whiteSpace: 'nowrap', color: '#000', fontStyle: 'italic' }}>
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div style={{ fontSize: '10pt', fontStyle: 'italic', color: '#000' }}>
                {exp.company}{exp.location ? `, ${exp.location}` : ''}
              </div>
              {exp.highlights.filter(h => h).length > 0 && (
                <ul
                  style={{
                    margin: '3pt 0 0 0',
                    paddingLeft: '16pt',
                    listStyleType: 'disc',
                  }}
                >
                  {exp.highlights.filter(h => h).map((highlight, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '10pt',
                        lineHeight: 1.35,
                        color: '#000',
                        marginBottom: '1.5pt',
                      }}
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
              {!exp.highlights.filter(h => h).length && exp.description && (
                <p style={{ fontSize: '10pt', color: '#000', margin: '3pt 0 0 0', lineHeight: 1.35 }}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section style={{ marginBottom: '6pt' }}>
          <SectionHeader title="PROJECTS" />
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '6pt' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '10.5pt' }}>
                    {proj.name}
                  </span>
                  {proj.technologies.length > 0 && (
                    <span style={{ fontSize: '10pt', color: '#000' }}>
                      {' '}| <span style={{ fontStyle: 'italic' }}>{proj.technologies.join(', ')}</span>
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '10pt', whiteSpace: 'nowrap', color: '#000', fontStyle: 'italic' }}>
                  {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                </span>
              </div>
              {proj.description && (
                <ul
                  style={{
                    margin: '3pt 0 0 0',
                    paddingLeft: '16pt',
                    listStyleType: 'disc',
                  }}
                >
                  {proj.description.split('. ').filter(s => s.trim()).map((sentence, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '10pt',
                        lineHeight: 1.35,
                        color: '#000',
                        marginBottom: '1.5pt',
                      }}
                    >
                      {sentence.endsWith('.') ? sentence : `${sentence}.`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* TECHNICAL SKILLS */}
      {skills.length > 0 && (
        <section style={{ marginBottom: '4pt' }}>
          <SectionHeader title="TECHNICAL SKILLS" />
          <SkillsGroup skills={skills} />
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <section>
          <SectionHeader title="CERTIFICATIONS" />
          {certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: '2pt', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '10.5pt' }}>{cert.name}</span>
                {cert.issuer && (
                  <span style={{ fontSize: '10pt', color: '#000' }}> — {cert.issuer}</span>
                )}
              </div>
              <span style={{ fontSize: '10pt', color: '#000', fontStyle: 'italic' }}>
                {formatDate(cert.date)}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

/* Section Header with horizontal rule - matches PDF exactly */
const SectionHeader = ({ title }: { title: string }) => (
  <div style={{ marginBottom: '4pt' }}>
    <h2
      style={{
        fontSize: '12pt',
        fontWeight: 700,
        letterSpacing: '0.5px',
        margin: 0,
        paddingBottom: '2pt',
        borderBottom: '1px solid #000',
        color: '#000',
      }}
    >
      {title}
    </h2>
  </div>
);

/* Group skills by level category */
const SkillsGroup = ({ skills }: { skills: { id: string; name: string; level: string }[] }) => {
  const categories: Record<string, string[]> = {};

  skills.forEach((skill) => {
    const label = getLevelLabel(skill.level);
    if (!categories[label]) categories[label] = [];
    categories[label].push(skill.name);
  });

  return (
    <div>
      {Object.entries(categories).map(([label, names]) => (
        <p key={label} style={{ fontSize: '10pt', margin: '0 0 2pt 0', lineHeight: 1.4 }}>
          <span style={{ fontWeight: 700 }}>{label}:</span>{' '}
          {names.join(', ')}
        </p>
      ))}
    </div>
  );
};

const getLevelLabel = (level: string): string => {
  switch (level) {
    case 'expert': return 'Expert';
    case 'advanced': return 'Advanced';
    case 'intermediate': return 'Intermediate';
    case 'beginner': return 'Basic';
    default: return 'Skills';
  }
};

export default ClassicTemplate;
