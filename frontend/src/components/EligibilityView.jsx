import React from 'react';
import { ShieldCheck, ArrowRight, UserCheck, CheckCircle, AlertTriangle, Building2 } from 'lucide-react';

export default function EligibilityView({ profile, onAskAI }) {
  const sampleChecks = [
    {
      title: 'Full Profile Eligibility Check',
      desc: `Check eligibility for all visiting companies with CGPA ${profile.cgpa || '8.2'}, ${profile.backlogs || '0'} backlogs, and batch ${profile.graduationYear || '2027'}.`,
      prompt: `My CGPA is ${profile.cgpa || '8.2'}, I have ${profile.backlogs || '0'} active backlogs, and I am in ${profile.course || 'B.E.'} ${profile.branch || 'CSE'} batch ${profile.graduationYear || '2027'}. Based on the official placement eligibility criteria in the documents, which companies am I eligible for?`,
    },
    {
      title: 'Adobe & Deloitte Eligibility',
      desc: 'Verify specific cutoff criteria, minimum CGPA, and backlog restrictions for Adobe and Deloitte.',
      prompt: `My CGPA is ${profile.cgpa || '8.2'}, I have ${profile.backlogs || '0'} backlogs, 10th percentage is 85%, and 12th percentage is 80% in CSE batch 2027. Am I eligible for Adobe and Deloitte according to the placement documents?`,
    },
    {
      title: 'Companies Accepting CGPA ≥ 7.0',
      desc: 'Discover all documented recruiters and roles that require a 7.0 CGPA threshold.',
      prompt: 'Which companies and recruitment drives in the placement documents have a minimum CGPA requirement of 7.0 or below?',
    },
    {
      title: 'Super Dream Offer Criteria',
      desc: 'Check requirements and salary benchmarks for Super Dream offers (₹10+ LPA).',
      prompt: 'What are the eligibility criteria and package statistics for Super Dream Offers (₹10 LPA+) mentioned in the placement documents?',
    },
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-icon-badge eligibility-badge">
          <ShieldCheck className="view-header-icon" />
        </div>
        <div>
          <h1 className="view-title">Placement Eligibility Evaluator</h1>
          <p className="view-subtitle">
            Verify your academic standing against official Chitkara University placement criteria using the Microsoft Foundry Agent and File Search knowledge.
          </p>
        </div>
      </div>

      {/* Profile Snapshot Card */}
      <div className="eligibility-profile-banner">
        <div className="profile-banner-left">
          <div className="profile-avatar-pill">
            <UserCheck className="pill-icon" />
            <span>Active Student Profile</span>
          </div>
          <h3 className="profile-banner-name">{profile.name} ({profile.course} {profile.branch})</h3>
          <div className="profile-metrics-pills">
            <span className="metric-pill">CGPA: <strong>{profile.cgpa}</strong></span>
            <span className="metric-pill">Backlogs: <strong>{profile.backlogs}</strong></span>
            <span className="metric-pill">Batch: <strong>{profile.graduationYear}</strong></span>
          </div>
        </div>
        <button
          type="button"
          className="run-check-btn"
          onClick={() => onAskAI(sampleChecks[0].prompt)}
        >
          <span>Run Full Eligibility Check</span>
          <ArrowRight className="btn-icon" />
        </button>
      </div>

      {/* One-Click Evaluation Cards */}
      <div className="section-block">
        <h3 className="section-title">Verified Eligibility Checks</h3>
        <div className="eligibility-cards-grid">
          {sampleChecks.map((check, idx) => (
            <div
              key={idx}
              className="eval-card"
              onClick={() => onAskAI(check.prompt)}
              role="button"
              tabIndex={0}
            >
              <div className="eval-card-header">
                <Building2 className="eval-card-icon" />
                <h4 className="eval-card-title">{check.title}</h4>
              </div>
              <p className="eval-card-desc">{check.desc}</p>
              <div className="eval-card-footer">
                <span className="eval-action-text">Ask AI Assistant</span>
                <ArrowRight className="eval-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
