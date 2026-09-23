import React from 'react';
import { Briefcase, ArrowRight, MessageSquare, Award, CheckCircle, HelpCircle } from 'lucide-react';

export default function InterviewPrepView({ onAskAI }) {
  const topics = [
    {
      title: 'Technical Interview Rounds',
      desc: 'Preparation strategy for core CS topics: Operating Systems, DBMS, Computer Networks, and OOPs.',
      prompt: 'How should I prepare for technical interviews for software engineering roles based on placement guidance?',
    },
    {
      title: 'HR & Behavioral Questions',
      desc: 'Master the STAR method for "Tell me about yourself", leadership, and situational questions.',
      prompt: 'What are common HR interview questions asked in campus recruitment drives and how should I structure my answers?',
    },
    {
      title: 'Company Selection Processes',
      desc: 'Understand the multi-stage recruitment pipeline: Online assessment, technical rounds, and managerial interviews.',
      prompt: 'Explain the typical company selection and interview process for campus placements mentioned in the placement documents.',
    },
    {
      title: 'Chitkara Placement Boot Camps',
      desc: 'Details about grooming, mock interviews, live projects, and technical boot camps.',
      prompt: 'What placement preparation support, boot camps, and mentorship are provided at Chitkara University?',
    },
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-icon-badge interview-badge">
          <Briefcase className="view-header-icon" />
        </div>
        <div>
          <h1 className="view-title">Interview Preparation Hub</h1>
          <p className="view-subtitle">
            Prepare for Technical, Core CS, and HR rounds with tailored strategies and verified placement guidance.
          </p>
        </div>
      </div>

      <div className="section-block">
        <h3 className="section-title">Interview Topics & AI Prompts</h3>
        <div className="interview-grid">
          {topics.map((t, idx) => (
            <div
              key={idx}
              className="prep-action-card"
              onClick={() => onAskAI(t.prompt)}
              role="button"
              tabIndex={0}
            >
              <div className="prep-card-content">
                <div className="prep-card-icon-wrap interview-icon-wrap">
                  <Briefcase className="prep-icon" />
                </div>
                <h4 className="prep-card-title">{t.title}</h4>
                <p className="prep-card-desc">{t.desc}</p>
              </div>
              <div className="prep-card-action">
                <span>Start Practice Session</span>
                <ArrowRight className="action-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
