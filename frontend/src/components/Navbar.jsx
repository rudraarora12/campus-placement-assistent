import React from 'react';
import { Menu, User, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Navbar({
  profile,
  onOpenAbout,
  onOpenCapabilities,
  onToggleSidebar,
  onNavigate,
}) {
  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'CP';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title="Toggle Navigation Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu className="toggle-icon" />
        </button>

        <div className="logo-container" onClick={() => onNavigate('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon" aria-hidden="true">
            CP
          </div>
          <span className="brand-title">Campus Placement Assistant</span>
        </div>

        <div className="status-badge" title="Microsoft Foundry Agent is active">
          <span className="status-dot"></span>
          <span>AI Agent Online</span>
        </div>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="nav-button"
          onClick={onOpenCapabilities}
          title="View Agent Capabilities"
        >
          Capabilities
        </button>

        <button
          type="button"
          className="nav-button"
          onClick={onOpenAbout}
          title="About Campus Placement Assistant"
        >
          About
        </button>

        {/* Student Profile Pill */}
        <div
          className="student-profile-pill"
          onClick={() => onNavigate('profile')}
          title="View / Edit Profile"
          role="button"
          tabIndex={0}
        >
          <div className="student-avatar-badge">{initials}</div>
          <div className="student-pill-details">
            <span className="student-pill-name">{profile?.name || 'Student'}</span>
            <span className="student-pill-branch">{profile?.branch ? profile.branch.split(' ')[0] : 'CSE'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
