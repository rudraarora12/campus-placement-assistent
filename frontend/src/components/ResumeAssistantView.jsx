import React from 'react';
import { FileText, ArrowRight, CheckCircle, Sparkles, Award } from 'lucide-react';

export default function ResumeAssistantView({ onAskAI }) {
  const resumePrompts = [
    {
      title: 'Resume Bullet Points & Action Verbs',
      desc: 'Formulate bullet points using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
      prompt: 'How can I write impactful resume bullet points with strong action verbs for software engineering campus placements?',
    },
    {
      title: 'Technical Skills & Project Structuring',
      desc: 'Organize Languages, Frameworks, Developer Tools, and CS Core competencies cleanly for ATS filters.',
      prompt: 'What is the best way to structure technical skills and projects on a college placement resume?',
    },
    {
      title: 'ATS Resume Review & Optimization',
      desc: 'Check ATS compliance, font guidelines, single-page formatting, and avoiding common screening traps.',
      prompt: 'What are the top ATS formatting rules and common resume mistakes to avoid during campus placement screening?',
    },
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-icon-badge resume-badge">
          <FileText className="view-header-icon" />
        </div>
        <div>
          <h1 className="view-title">Resume Assistant</h1>
          <p className="view-subtitle">
            Craft placement-ready, ATS-compliant resumes with strong impact metrics and clean project descriptions.
          </p>
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-title">Resume Guidance & Prompts</h3>
        <div className="interview-grid">
          {resumePrompts.map((rp, idx) => (
            <div
              key={idx}
              className="prep-action-card"
              onClick={() => onAskAI(rp.prompt)}
              role="button"
              tabIndex={0}
            >
              <div className="prep-card-content">
                <div className="prep-card-icon-wrap resume-icon-wrap">
                  <FileText className="prep-icon" />
                </div>
                <h4 className="prep-card-title">{rp.title}</h4>
                <p className="prep-card-desc">{rp.desc}</p>
              </div>
              <div className="prep-card-action">
                <span>Ask AI Assistant</span>
                <ArrowRight className="action-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
