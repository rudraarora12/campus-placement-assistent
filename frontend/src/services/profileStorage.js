/**
 * Profile Storage Service
 * Manages student profile in browser localStorage.
 */

const STORAGE_KEY_PROFILE = 'campus_placement_profile';

const DEFAULT_PROFILE = {
  name: 'Rudra Sharma',
  course: 'B.E.',
  branch: 'Computer Science & Engineering',
  graduationYear: '2027',
  cgpa: '8.2',
  backlogs: '0',
  email: 'rudra3388.beai24@chitkara.edu.in',
  targetRole: 'Software Development Engineer (SDE)',
};

/**
 * Gets student profile from localStorage or default.
 * @returns {Object}
 */
export function getProfile() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!data) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
  } catch (error) {
    console.error('Failed to load profile from localStorage:', error);
    return DEFAULT_PROFILE;
  }
}

/**
 * Saves student profile to localStorage.
 * @param {Object} profile
 */
export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile to localStorage:', error);
  }
}

/**
 * Calculates profile completion percentage based on filled fields.
 * @param {Object} profile
 * @returns {number}
 */
export function calculateProfileCompletion(profile = getProfile()) {
  const fields = ['name', 'course', 'branch', 'graduationYear', 'cgpa', 'backlogs', 'email'];
  let filled = 0;
  for (const f of fields) {
    if (profile[f] && String(profile[f]).trim() !== '') {
      filled++;
    }
  }
  return Math.round((filled / fields.length) * 100);
}
