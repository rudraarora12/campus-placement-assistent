import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  BookOpen,
  Calendar,
  Layers,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    graduationYear: '2027',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeUpdates, setAgreeUpdates] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validation rules for password
  const hasMinLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasDigit = /[0-9]/.test(formData.password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasDigit;

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

    // Validation checks
    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please provide a valid student email address.');
      return;
    }
    if (!formData.password) {
      setError('Please create a secure password.');
      return;
    }
    if (!isPasswordValid) {
      setError(
        'Password must be at least 8 characters long, and include uppercase, lowercase, and numeric characters.'
      );
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-check.');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        course: formData.course,
        branch: formData.branch,
        graduationYear: formData.graduationYear,
      });
      navigate('/assistant', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background ambient glow */}
      <div className="auth-ambient-glow auth-glow-1" />
      <div className="auth-ambient-glow auth-glow-2" />

      {/* Main 2-Column Split Card */}
      <div className="split-auth-card split-auth-card-wide">
        {/* Left Hero & Social Proof Panel */}
        <div className="split-auth-left">
          {/* Brand Row */}
          <div className="split-brand-row">
            <div className="split-brand-icon-box">
              <GraduationCap className="split-brand-icon" />
            </div>
            <span className="split-brand-title">Placement Assistant</span>
          </div>

          {/* Hero Content */}
          <div className="split-hero-content">
            <h1 className="split-hero-heading">
              Always be the <span className="split-hero-highlight">first to apply</span> for the best jobs.
            </h1>

            {/* High-Impact Statistics */}
            <div className="split-stats-block">
              <div className="split-stat-item">
                <span className="split-stat-num">400,000+</span>
                <span className="split-stat-label">Today's New Recruitment Updates</span>
              </div>
              <div className="split-stat-item">
                <span className="split-stat-num">8,000,000+</span>
                <span className="split-stat-label">Total Student Placement Sessions</span>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="split-benefits-list">
              <div className="split-benefit-item">
                <div className="split-benefit-icon-wrapper">
                  <Check size={16} />
                </div>
                <span>2X More Qualified Job Matches</span>
              </div>
              <div className="split-benefit-item">
                <div className="split-benefit-icon-wrapper">
                  <Zap size={16} />
                </div>
                <span>60% Time Savings in Job Searches & Prep</span>
              </div>
              <div className="split-benefit-item">
                <div className="split-benefit-icon-wrapper">
                  <ShieldCheck size={16} />
                </div>
                <span>50% More Interview Invites & Grounded Answers</span>
              </div>
            </div>
          </div>

          {/* Footer Pills */}
          <div className="split-footer-pill-row">
            <span className="split-footer-pill">Foundry Agent v23</span>
            <span className="split-footer-pill">File Search RAG</span>
            <span className="split-footer-pill">Instant Prep</span>
          </div>
        </div>

        {/* Right Authentication Form Panel */}
        <div className="split-auth-right">
          <div className="split-auth-header">
            <h2 className="split-auth-title">Sign up To Continue Applying</h2>
            <p className="split-auth-subtitle">
              Fill in your details to get personalized eligibility and AI assistance
            </p>
          </div>

          {/* Optional Google / SSO Button */}
          <button
            type="button"
            className="split-google-btn"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                name: 'Student Candidate',
                email: 'student.applicant@chitkara.edu.in',
                password: 'Password123!',
                confirmPassword: 'Password123!',
              }));
            }}
            title="Auto-fill sample student data"
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
            <span>Sign up with Student SSO</span>
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
            {/* Full Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="split-form-group">
                <label htmlFor="signup-name" className="split-form-label">
                  Full Name
                </label>
                <div className="split-input-box">
                  <User className="split-input-icon" />
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Alex Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="split-input"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="split-form-group">
                <label htmlFor="signup-email" className="split-form-label">
                  Student Email
                </label>
                <div className="split-input-box">
                  <Mail className="split-input-icon" />
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="split-input"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Academic Details (Course, Branch, Batch) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '0.75rem' }}>
              <div className="split-form-group">
                <label htmlFor="signup-course" className="split-form-label">
                  Degree
                </label>
                <div className="split-input-box">
                  <BookOpen className="split-input-icon" />
                  <select
                    id="signup-course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="split-input split-select"
                    disabled={isLoading}
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                  </select>
                </div>
              </div>

              <div className="split-form-group">
                <label htmlFor="signup-branch" className="split-form-label">
                  Branch
                </label>
                <div className="split-input-box">
                  <Layers className="split-input-icon" />
                  <select
                    id="signup-branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="split-input split-select"
                    disabled={isLoading}
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="AI & Data Science">AI & DS</option>
                    <option value="Electronics & Communication">ECE</option>
                  </select>
                </div>
              </div>

              <div className="split-form-group">
                <label htmlFor="signup-year" className="split-form-label">
                  Batch
                </label>
                <div className="split-input-box">
                  <Calendar className="split-input-icon" />
                  <select
                    id="signup-year"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="split-input split-select"
                    disabled={isLoading}
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="split-form-group">
                <label htmlFor="signup-password" className="split-form-label">
                  Password
                </label>
                <div className="split-input-box">
                  <Lock className="split-input-icon" />
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 chars"
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
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="split-form-group">
                <label htmlFor="signup-confirm-password" className="split-form-label">
                  Confirm Password
                </label>
                <div className="split-input-box">
                  <Lock className="split-input-icon" />
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="split-input"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="split-toggle-eye"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <label className="split-checkbox-row">
              <input
                type="checkbox"
                checked={agreeUpdates}
                onChange={(e) => setAgreeUpdates(e.target.checked)}
                className="split-checkbox"
              />
              <span className="split-checkbox-label">
                I want to receive updates from Placement Assistant about latest job offers & eligibility criteria
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
                  <span>CREATING ACCOUNT...</span>
                </>
              ) : (
                <>
                  <span>SIGN UP</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Terms note */}
            <p className="split-terms-note">
              By continuing, you agree to the Placement Assistant Terms of Service and Privacy Policy.
            </p>
          </form>

          {/* Switch to Login */}
          <div className="split-auth-switch">
            <span>Already a member?</span>
            <Link to="/login" className="split-switch-link">
              Sign in now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
