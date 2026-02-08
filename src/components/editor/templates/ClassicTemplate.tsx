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
        fontSize: '10pt',
        lineHeight: '1.3',
        color: '#000',
        padding: '12mm 14mm 10mm 14mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Header - Centered Name */}
      <div style={{ textAlign: 'center', marginBottom: '2pt' }}>
        <h1
          style={{
            fontSize: '20pt',
            fontWeight: 700,
            letterSpacing: '1px',
            margin: 0,
            lineHeight: 1.2,
            color: '#000',
          }}
        >
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
      </div>

      {/* Contact Info - Centered, separated by · */}
      {contactParts.length > 0 && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '9pt',
            color: '#333',
            marginBottom: '8pt',
            lineHeight: 1.4,
          }}
        >
          {contactParts.map((part, idx) => (
            <span key={idx}>
              {idx > 0 && <span style={{ margin: '0 4pt' }}>·</span>}
              <span style={{ textDecoration: part.includes('@') || part.includes('.com') || part.includes('linkedin') || part.includes('github') ? 'underline' : 'none' }}>
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
              fontSize: '9.5pt',
              lineHeight: 1.35,
              color: '#222',
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
                  <span style={{ fontWeight: 700, fontSize: '9.5pt' }}>
                    {edu.institution}
                  </span>
                  <br />
                  <span style={{ fontStyle: 'italic', fontSize: '9pt', color: '#333' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '9pt', whiteSpace: 'nowrap', color: '#333', fontStyle: 'italic' }}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  {edu.gpa && (
                    <>
                      <br />
                      <span style={{ fontStyle: 'italic' }}>CGPA: {edu.gpa}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* EXPERIENCE / INTERNSHIP */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '6pt' }}>
          <SectionHeader title="INTERNSHIP/TRAINING" />
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '5pt' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '9.5pt' }}>
                    {exp.position}
                  </span>
                  <br />
                  <span style={{ fontStyle: 'italic', fontSize: '9pt', color: '#333' }}>
                    {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  </span>
                </div>
                <span style={{ fontSize: '9pt', whiteSpace: 'nowrap', color: '#333', fontStyle: 'italic' }}>
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.highlights.filter(h => h).length > 0 && (
                <ul
                  style={{
                    margin: '2pt 0 0 0',
                    paddingLeft: '14pt',
                    listStyleType: 'disc',
                  }}
                >
                  {exp.highlights.filter(h => h).slice(0, 5).map((highlight, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '9pt',
                        lineHeight: 1.3,
                        color: '#222',
                        marginBottom: '1pt',
                      }}
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
              {!exp.highlights.filter(h => h).length && exp.description && (
                <p style={{ fontSize: '9pt', color: '#222', margin: '2pt 0 0 0', lineHeight: 1.3 }}>
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
            <div key={proj.id} style={{ marginBottom: '5pt' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '9.5pt' }}>
                    {proj.name}
                  </span>
                  {proj.technologies.length > 0 && (
                    <span style={{ fontSize: '9pt', color: '#333' }}>
                      {' '}| <span style={{ fontStyle: 'italic' }}>{proj.technologies.join(', ')}</span>
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '9pt', whiteSpace: 'nowrap', color: '#333', fontStyle: 'italic' }}>
                  {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                </span>
              </div>
              {proj.description && (
                <ul
                  style={{
                    margin: '2pt 0 0 0',
                    paddingLeft: '14pt',
                    listStyleType: 'disc',
                  }}
                >
                  {proj.description.split('. ').filter(s => s.trim()).slice(0, 5).map((sentence, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '9pt',
                        lineHeight: 1.3,
                        color: '#222',
                        marginBottom: '1pt',
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
                <span style={{ fontWeight: 700, fontSize: '9.5pt' }}>{cert.name}</span>
                {cert.issuer && (
                  <span style={{ fontSize: '9pt', color: '#333' }}> — {cert.issuer}</span>
                )}
              </div>
              <span style={{ fontSize: '9pt', color: '#333', fontStyle: 'italic' }}>
                {formatDate(cert.date)}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

/* Section Header with horizontal rule */
const SectionHeader = ({ title }: { title: string }) => (
  <div style={{ marginBottom: '4pt' }}>
    <h2
      style={{
        fontSize: '11pt',
        fontWeight: 700,
        letterSpacing: '0.5px',
        margin: 0,
        paddingBottom: '2pt',
        borderBottom: '1.5px solid #000',
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
        <p key={label} style={{ fontSize: '9.5pt', margin: '0 0 1pt 0', lineHeight: 1.35 }}>
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
