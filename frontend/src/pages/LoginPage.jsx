import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const from =
    location.state?.from?.pathname && location.state.from.pathname !== '/dashboard'
      ? location.state.from.pathname
      : '/assistant';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim()) {
      setError('Please enter your student email address.');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background ambient lighting */}
      <div className="auth-ambient-glow auth-glow-1" />
      <div className="auth-ambient-glow auth-glow-2" />

      {/* Main 2-Column Split Card */}
      <div className="split-auth-card">
        {/* Left Hero & Social Proof Panel */}
        <div className="split-auth-left">
          {/* Brand Row */}
          <div className="split-brand-row">
            <div className="split-brand-icon-box">
              <GraduationCap className="split-brand-icon" />
            </div>
            <span className="split-brand-title">Placement Assistant</span>
          </div>

          {/* Hero Pitch */}
          <div className="split-hero-content">
            <h1 className="split-hero-heading">
              Always be the <span className="split-hero-highlight">first to clear</span> the best placements.
            </h1>

            {/* High-Impact Statistics */}
            <div className="split-stats-block">
              <div className="split-stat-item">
                <span className="split-stat-num">500+</span>
                <span className="split-stat-label">Visiting Recruiters & Drives</span>
              </div>
              <div className="split-stat-item">
                <span className="split-stat-num">10,000+</span>
                <span className="split-stat-label">Placement Queries Grounded</span>
              </div>
            </div>

            {/* Value Highlights with Badges */}
            <div className="split-benefits-list">
              <div className="split-benefit-item">
                <div className="split-benefit-icon-wrapper">
                  <Check size={16} />
                </div>
                <span>2X More Verified Placement Matches</span>
              </div>
              <div className="split-benefit-item">
                <div className="split-benefit-icon-wrapper">
                  <Zap size={16} />
                </div>
                <span>60% Time Savings in Interview & DSA Prep</span>
              </div>
              <div className="split-benefit-item">
                <div className="split-benefit-icon-wrapper">
                  <ShieldCheck size={16} />
                </div>
                <span>100% Grounded in Official College Policies</span>
              </div>
            </div>
          </div>

          {/* Footer Pills */}
          <div className="split-footer-pill-row">
            <span className="split-footer-pill">Foundry Agent v23</span>
            <span className="split-footer-pill">File Search RAG</span>
            <span className="split-footer-pill">GPT-4.1-mini</span>
          </div>
        </div>

        {/* Right Authentication Form Panel */}
        <div className="split-auth-right">
          <div className="split-auth-header">
            <h2 className="split-auth-title">Sign In To Continue</h2>
            <p className="split-auth-subtitle">
              Access your personalized dashboard, interview prep, and AI chat
            </p>
          </div>

          {/* Optional Google SSO Button */}
          <button
            type="button"
            className="split-google-btn"
            onClick={() => {
              // Pre-fill student demo credentials for easy login testing
              setFormData({
                email: 'rudra3388.beai24@chitkara.edu.in',
                password: 'Password123!',
              });
            }}
            title="Auto-fill verified student credentials"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Student SSO</span>
          </button>

          {/* Divider */}
          <div className="split-divider-row">
            <div className="split-divider-line" />
            <span className="split-divider-text">OR EMAIL</span>
            <div className="split-divider-line" />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="split-error-banner" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="split-auth-form" noValidate>
            <div className="split-form-group">
              <label htmlFor="login-email" className="split-form-label">
                Student Email Address
              </label>
              <div className="split-input-box">
                <Mail className="split-input-icon" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@chitkara.edu.in"
                  value={formData.email}
                  onChange={handleChange}
                  className="split-input"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="split-form-group">
              <label htmlFor="login-password" className="split-form-label">
                Password
              </label>
              <div className="split-input-box">
                <Lock className="split-input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="split-input"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="split-toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <label className="split-checkbox-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="split-checkbox"
              />
              <span className="split-checkbox-label">
                Keep me signed in with secure HTTP-only session
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="split-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="btn-spinner" />
                  <span>SIGNING IN...</span>
                </>
              ) : (
                <>
                  <span>SIGN IN</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Terms note */}
            <p className="split-terms-note">
              By continuing, you access the official Campus Placement Assistant grounded in Microsoft Azure AI Foundry.
            </p>
          </form>

          {/* Switch to Signup */}
          <div className="split-auth-switch">
            <span>New student?</span>
            <Link to="/signup" className="split-switch-link">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
