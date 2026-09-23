import React, { useState } from 'react';
import { User, Save, CheckCircle, GraduationCap, Award, BookOpen, AlertCircle } from 'lucide-react';

export default function ProfileView({ profile, onSaveProfile }) {
  const [formData, setFormData] = useState(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-icon-badge">
          <User className="view-header-icon" />
        </div>
        <div>
          <h1 className="view-title">Student Profile</h1>
          <p className="view-subtitle">
            Manage your academic details. These are stored locally in your browser and used to tailor placement eligibility checks.
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-form-card">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="e.g. Rudra Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="e.g. student@chitkara.edu.in"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="course">Degree / Course</label>
                <input
                  id="course"
                  type="text"
                  name="course"
                  className="form-input"
                  value={formData.course || ''}
                  onChange={handleChange}
                  placeholder="e.g. B.E."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="branch">Branch / Specialization</label>
                <input
                  id="branch"
                  type="text"
                  name="branch"
                  className="form-input"
                  value={formData.branch || ''}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science & Engineering"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="graduationYear">Graduation Year / Batch</label>
                <input
                  id="graduationYear"
                  type="text"
                  name="graduationYear"
                  className="form-input"
                  value={formData.graduationYear || ''}
                  onChange={handleChange}
                  placeholder="e.g. 2027"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cgpa">Current Cumulative CGPA</label>
                <input
                  id="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  className="form-input"
                  value={formData.cgpa || ''}
                  onChange={handleChange}
                  placeholder="e.g. 8.2"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="backlogs">Active Backlogs</label>
                <input
                  id="backlogs"
                  type="number"
                  min="0"
                  max="20"
                  name="backlogs"
                  className="form-input"
                  value={formData.backlogs || '0'}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="targetRole">Target Placement Role</label>
              <input
                id="targetRole"
                type="text"
                name="targetRole"
                className="form-input"
                value={formData.targetRole || ''}
                onChange={handleChange}
                placeholder="e.g. SDE-1 / AI & Data Science Engineer"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <Save className="btn-icon" />
                <span>Save Profile to LocalStorage</span>
              </button>
              {savedSuccess && (
                <div className="save-success-msg">
                  <CheckCircle className="msg-icon" />
                  <span>Profile updated successfully!</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Profile Info Sidebar */}
        <div className="profile-info-side">
          <div className="info-box note-box">
            <AlertCircle className="info-icon" />
            <div>
              <h4 className="info-title">Grounding Notice</h4>
              <p className="info-desc">
                Saving your profile stores it in your browser. When you ask the AI Assistant for placement eligibility, your profile details will be matched against the official criteria in the placement documents.
              </p>
            </div>
          </div>

          <div className="profile-summary-card">
            <h4 className="summary-title">Profile Summary</h4>
            <div className="summary-item">
              <span className="summary-label">Student:</span>
              <span className="summary-val">{formData.name || 'Not set'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Program:</span>
              <span className="summary-val">{formData.course} {formData.branch}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Batch:</span>
              <span className="summary-val">{formData.graduationYear}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">CGPA:</span>
              <span className="summary-val highlight-val">{formData.cgpa} / 10.0</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Backlogs:</span>
              <span className="summary-val">{formData.backlogs}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
