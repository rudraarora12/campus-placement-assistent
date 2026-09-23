import React from 'react';
import {
  LayoutDashboard,
  Bot,
  GraduationCap,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MainSidebar({
  currentView,
  onNavigate,
  isOpen,
  onClose,
}) {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Assistant', icon: Bot, badge: 'Foundry' },
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="main-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`main-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="main-sidebar-brand" onClick={() => onNavigate('dashboard')}>
          <div className="main-brand-icon">
            <GraduationCap className="brand-cap-icon" />
          </div>
          <div className="main-brand-text">
            <span className="brand-main-title">Campus Placement</span>
            <span className="brand-sub-title">AI Assistant</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="main-sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`main-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      onNavigate(item.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                  >
                    <Icon className="nav-item-icon" />
                    <span className="nav-item-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-item-badge">
                        <Sparkles className="badge-sparkle" />
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer with Logged In User info & Logout */}
        <div className="main-sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name">{user?.name || 'Student'}</span>
              <span className="sidebar-user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
