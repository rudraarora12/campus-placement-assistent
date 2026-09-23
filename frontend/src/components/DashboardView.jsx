import React from 'react';
import {
  Sparkles,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Code2,
  FileText,
  Clock,
  Plus,
  Minus,
} from 'lucide-react';

export default function DashboardView({
  profile,
  conversations,
  progress,
  activities,
  onOpenChat,
  onOpenChatWithConversation,
  onAskAI,
  onUpdateCategoryProgress,
}) {
  const profileCompletion = Math.round(
    Object.values(profile).filter((v) => String(v).trim() !== '').length / 7 * 100
  );

  return (
    <div className="dashboard-content">
      {/* Welcome Banner */}
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h1 className="dashboard-title">
            Good morning, {profile.name ? profile.name.split(' ')[0] : 'Student'} 👋
          </h1>
          <p className="dashboard-subtitle">
            Track your campus placement preparation and get help from your AI assistant.
          </p>
        </div>
        <div className="dashboard-header-badge">
          <span className="batch-pill">Batch {profile.graduationYear || '2027'}</span>
          <span className="branch-pill">{profile.branch || 'B.E. CSE'}</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Placement Readiness</span>
            <div className="stat-icon-wrapper readiness-icon">
              <TrendingUp className="stat-icon" />
            </div>
          </div>
          <div className="stat-value">{progress.readinessPercentage || 72}%</div>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill"
              style={{ width: `${progress.readinessPercentage || 72}%` }}
            ></div>
          </div>
          <span className="stat-footer-text">Preparation tracking estimate</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">AI Conversations</span>
            <div className="stat-icon-wrapper chat-icon">
              <MessageSquare className="stat-icon" />
            </div>
          </div>
          <div className="stat-value">{conversations.length}</div>
          <span className="stat-subtext">Stored locally in browser</span>
          <span className="stat-footer-text">Active conversations</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Preparation Progress</span>
            <div className="stat-icon-wrapper progress-icon">
              <CheckCircle className="stat-icon" />
            </div>
          </div>
          <div className="stat-value">
            {progress.completedTopicsCount || 14}{' '}
            <span className="stat-total">/ {progress.totalTopicsCount || 20}</span>
          </div>
          <span className="stat-subtext">Core topics completed</span>
          <span className="stat-footer-text">Self-guided roadmap</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Profile Completion</span>
            <div className="stat-icon-wrapper profile-icon">
              <UserCheck className="stat-icon" />
            </div>
          </div>
          <div className="stat-value">{profileCompletion}%</div>
          <div className="stat-progress-bar">
            <div
              className="stat-progress-fill profile-fill"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <span className="stat-footer-text">CGPA: {profile.cgpa || '8.2'} • 0 Backlogs</span>
        </div>
      </div>

      {/* Featured AI Assistant Hero Card */}
      <div className="ai-feature-card">
        <div className="ai-feature-glow"></div>
        <div className="ai-feature-body">
          <div className="ai-feature-badge">
            <Sparkles className="badge-icon" />
            <span>Microsoft Foundry Agent • Campus-Placement-Assistant v23</span>
          </div>
          <h2 className="ai-feature-title">Ask your Placement AI</h2>
          <p className="ai-feature-desc">
            Get verified answers based on your placement knowledge base and prepare for campus
            placements, recruiter criteria, CTC packages, and technical rounds.
          </p>
          <div className="ai-feature-actions">
            <button
              type="button"
              className="primary-action-btn"
              onClick={() => onOpenChat()}
            >
              <span>Open AI Assistant</span>
              <ArrowRight className="btn-arrow" />
            </button>
            <button
              type="button"
              className="secondary-action-btn"
              onClick={() =>
                onAskAI(
                  `My CGPA is ${profile.cgpa || '8.2'}, I have ${profile.backlogs || '0'} backlogs, and I am in ${profile.course || 'B.E.'} ${profile.branch || 'CSE'} batch ${profile.graduationYear || '2027'}. Based on the placement documents, which companies am I eligible for?`
                )
              }
            >
              <span>Check Eligibility</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="section-block">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <div
            className="action-card"
            onClick={() =>
              onAskAI(
                `My CGPA is ${profile.cgpa || '8.2'}, I have ${profile.backlogs || '0'} backlogs, and I am in ${profile.course || 'B.E.'} ${profile.branch || 'CSE'} batch ${profile.graduationYear || '2027'}. Check my placement eligibility against the visiting companies.`
              )
            }
            role="button"
            tabIndex={0}
          >
            <div className="action-card-icon eligibility-bg">
              <ShieldCheck className="action-icon" />
            </div>
            <div className="action-card-text">
              <h4 className="action-card-title">Check Placement Eligibility</h4>
              <p className="action-card-desc">
                Evaluate your CGPA, branch, and profile against company criteria.
              </p>
            </div>
            <ArrowRight className="action-card-arrow" />
          </div>

          <div
            className="action-card"
            onClick={() =>
              onAskAI(
                'How should I prepare for technical and HR interviews for campus recruitment based on the placement guidance?'
              )
            }
            role="button"
            tabIndex={0}
          >
            <div className="action-card-icon interview-bg">
              <Briefcase className="action-icon" />
            </div>
            <div className="action-card-text">
              <h4 className="action-card-title">Prepare for Interview</h4>
              <p className="action-card-desc">
                Technical core CS questions, behavioral patterns, and HR rounds.
              </p>
            </div>
            <ArrowRight className="action-card-arrow" />
          </div>

          <div
            className="action-card"
            onClick={() =>
              onAskAI(
                'Give me a structured DSA preparation plan and roadmap for campus recruitment technical rounds.'
              )
            }
            role="button"
            tabIndex={0}
          >
            <div className="action-card-icon dsa-bg">
              <Code2 className="action-icon" />
            </div>
            <div className="action-card-text">
              <h4 className="action-card-title">Practice DSA</h4>
              <p className="action-card-desc">
                Topic-wise coding roadmaps, LeetCode patterns, and complexity analysis.
              </p>
            </div>
            <ArrowRight className="action-card-arrow" />
          </div>

          <div
            className="action-card"
            onClick={() =>
              onAskAI(
                'How can I optimize my resume and write strong impact bullet points for software engineering campus placements?'
              )
            }
            role="button"
            tabIndex={0}
          >
            <div className="action-card-icon resume-bg">
              <FileText className="action-icon" />
            </div>
            <div className="action-card-text">
              <h4 className="action-card-title">Improve Resume</h4>
              <p className="action-card-desc">
                Action-verb bullets, technical skill grouping, and ATS optimization.
              </p>
            </div>
            <ArrowRight className="action-card-arrow" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Chats & Preparation Progress */}
      <div className="dashboard-two-col">
        {/* Recent Chats Section */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-wrapper">
              <Clock className="panel-icon" />
              <h3 className="panel-title">Recent Conversations</h3>
            </div>
            {conversations.length > 0 && (
              <button
                type="button"
                className="panel-link-btn"
                onClick={() => onOpenChat()}
              >
                Open Assistant ({conversations.length})
              </button>
            )}
          </div>

          <div className="panel-body">
            {conversations.length === 0 ? (
              <div className="empty-panel-state">
                <MessageSquare className="empty-state-icon" />
                <p className="empty-state-text">No conversations yet.</p>
                <button
                  type="button"
                  className="start-chat-btn"
                  onClick={() => onOpenChat()}
                >
                  Start your first conversation →
                </button>
              </div>
            ) : (
              <div className="recent-chats-list">
                {conversations.slice(0, 4).map((conv) => {
                  const lastMsg =
                    conv.messages && conv.messages.length > 0
                      ? conv.messages[conv.messages.length - 1]
                      : null;
                  const preview = lastMsg
                    ? (lastMsg.content || lastMsg.text || '').substring(0, 75) + '...'
                    : 'Empty conversation';

                  return (
                    <div
                      key={conv.id}
                      className="recent-chat-item"
                      onClick={() => onOpenChatWithConversation(conv.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="recent-chat-info">
                        <h4 className="recent-chat-title">{conv.title || 'New Chat'}</h4>
                        <p className="recent-chat-preview">"{preview}"</p>
                      </div>
                      <div className="recent-chat-action">
                        <span className="recent-chat-count">
                          {conv.messages ? conv.messages.length : 0} msgs
                        </span>
                        <span className="open-chat-tag">Open →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Preparation Progress Section */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-wrapper">
              <TrendingUp className="panel-icon" />
              <h3 className="panel-title">Placement Preparation</h3>
            </div>
            <span className="panel-hint">Saved in localStorage</span>
          </div>

          <div className="panel-body">
            <div className="prep-categories-list">
              {(progress.categories || []).map((cat) => (
                <div key={cat.id} className="prep-category-card">
                  <div className="prep-cat-header">
                    <div className="prep-cat-title">
                      <span className="prep-cat-icon">{cat.icon || '📌'}</span>
                      <span>{cat.name}</span>
                    </div>
                    <div className="prep-cat-stats">
                      <span className="prep-cat-count">
                        {cat.completed}/{cat.total} topics
                      </span>
                      <div className="prep-counter-btns">
                        <button
                          type="button"
                          className="counter-btn"
                          onClick={() => onUpdateCategoryProgress(cat.id, -1)}
                          disabled={cat.completed <= 0}
                          title="Decrease completed"
                        >
                          <Minus className="counter-icon" />
                        </button>
                        <button
                          type="button"
                          className="counter-btn"
                          onClick={() => onUpdateCategoryProgress(cat.id, 1)}
                          disabled={cat.completed >= cat.total}
                          title="Increase completed"
                        >
                          <Plus className="counter-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="prep-progress-bar">
                    <div
                      className="prep-progress-fill"
                      style={{ width: `${cat.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="section-block">
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-list">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-details">
                <div className="activity-title">{act.title}</div>
                <div className="activity-desc">{act.description}</div>
              </div>
              <span className="activity-time">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
