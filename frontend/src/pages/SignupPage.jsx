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
  CheckCircle2,
  Loader2,
  Sparkles,
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
      setError('Please provide a valid email address.');
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
      <div className="auth-ambient-glow auth-glow-1" />
      <div className="auth-ambient-glow auth-glow-2" />

      <div className="auth-card-wrapper auth-card-wrapper-wide">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="auth-brand-badge">
            <GraduationCap className="auth-brand-icon" />
          </div>
          <h1 className="auth-title">Campus Placement Assistant</h1>
          <p className="auth-subtitle">
            Create your account to access AI-driven placement assistance
          </p>
        </div>

        {/* Main Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Student Registration</h2>
            <p className="auth-card-desc">
              Fill in your academic details to get personalized eligibility & prep
            </p>
          </div>

          {error && (
            <div className="auth-error-banner" role="alert">
              <AlertCircle className="auth-error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name & Email (2 columns on tablet/desktop) */}
            <div className="auth-form-grid">
              <div className="auth-form-group">
                <label htmlFor="signup-name" className="auth-label">
                  Full Name
                </label>
                <div className="auth-input-wrapper">
                  <User className="auth-field-icon" />
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Alex Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="auth-input"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="signup-email" className="auth-label">
                  Student Email
                </label>
                <div className="auth-input-wrapper">
                  <Mail className="auth-field-icon" />
                  <input
                    id="signup-email"
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
            </div>

            {/* Academic Details (Course, Branch, Year) */}
            <div className="auth-form-grid auth-form-grid-3">
              <div className="auth-form-group">
                <label htmlFor="signup-course" className="auth-label">
                  Degree / Program
                </label>
                <div className="auth-input-wrapper">
                  <BookOpen className="auth-field-icon" />
                  <select
                    id="signup-course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="auth-input auth-select"
                    disabled={isLoading}
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Sc CS">B.Sc CS</option>
                  </select>
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="signup-branch" className="auth-label">
                  Branch / Stream
                </label>
                <div className="auth-input-wrapper">
                  <Layers className="auth-field-icon" />
                  <select
                    id="signup-branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="auth-input auth-select"
                    disabled={isLoading}
                  >
                    <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Comm. (ECE)</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="signup-year" className="auth-label">
                  Batch / Passing Year
                </label>
                <div className="auth-input-wrapper">
                  <Calendar className="auth-field-icon" />
                  <select
                    id="signup-year"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="auth-input auth-select"
                    disabled={isLoading}
                  >
                    <option value="2025">2025 Batch</option>
                    <option value="2026">2026 Batch</option>
                    <option value="2027">2027 Batch</option>
                    <option value="2028">2028 Batch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="auth-form-grid">
              <div className="auth-form-group">
                <label htmlFor="signup-password" className="auth-label">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-field-icon" />
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 chars (A-Z, a-z, 0-9)"
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

              <div className="auth-form-group">
                <label htmlFor="signup-confirm-password" className="auth-label">
                  Confirm Password
                </label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-field-icon" />
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="auth-input"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="auth-toggle-visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Requirement Chips */}
            {formData.password && (
              <div className="auth-password-requirements">
                <span className={`req-chip ${hasMinLength ? 'met' : ''}`}>
                  {hasMinLength ? '✓' : '•'} 8+ Characters
                </span>
                <span className={`req-chip ${hasUpper ? 'met' : ''}`}>
                  {hasUpper ? '✓' : '•'} 1 Uppercase
                </span>
                <span className={`req-chip ${hasLower ? 'met' : ''}`}>
                  {hasLower ? '✓' : '•'} 1 Lowercase
                </span>
                <span className={`req-chip ${hasDigit ? 'met' : ''}`}>
                  {hasDigit ? '✓' : '•'} 1 Number
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="btn-spinner" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Login */}
          <div className="auth-card-footer">
            <p className="auth-footer-text">
              Already registered?{' '}
              <Link to="/login" className="auth-link">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
