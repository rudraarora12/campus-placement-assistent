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
  Sparkles,
  Loader2,
  CheckCircle2,
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname && location.state.from.pathname !== '/dashboard'
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

    // Basic client-side validation
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
      {/* Background glowing ambient elements */}
      <div className="auth-ambient-glow auth-glow-1" />
      <div className="auth-ambient-glow auth-glow-2" />

      <div className="auth-card-wrapper">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-brand-badge">
            <GraduationCap className="auth-brand-icon" />
          </div>
          <h1 className="auth-title">Campus Placement Assistant</h1>
          <p className="auth-subtitle">
            AI-powered placement prep with Azure Foundry Agent
          </p>
        </div>

        {/* Main Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Student Login</h2>
            <p className="auth-card-desc">
              Access your personalized dashboard, interview prep, and AI chat
            </p>
          </div>

          {error && (
            <div className="auth-error-banner" role="alert">
              <AlertCircle className="auth-error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email Field */}
            <div className="auth-form-group">
              <label htmlFor="login-email" className="auth-label">
                Student Email Address
              </label>
              <div className="auth-input-wrapper">
                <Mail className="auth-field-icon" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="student@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-form-group">
              <div className="auth-label-row">
                <label htmlFor="login-password" className="auth-label">
                  Password
                </label>
              </div>
              <div className="auth-input-wrapper">
                <Lock className="auth-field-icon" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="auth-toggle-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="btn-spinner" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Signup */}
          <div className="auth-card-footer">
            <p className="auth-footer-text">
              New student?{' '}
              <Link to="/signup" className="auth-link">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Feature Highlights Footer */}
        <div className="auth-features-row">
          <div className="auth-feature-pill">
            <CheckCircle2 size={14} className="feature-pill-icon" />
            <span>Foundry Agent v23</span>
          </div>
          <div className="auth-feature-pill">
            <Sparkles size={14} className="feature-pill-icon" />
            <span>File Search RAG</span>
          </div>
          <div className="auth-feature-pill">
            <CheckCircle2 size={14} className="feature-pill-icon" />
            <span>Secure HTTP-only Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
