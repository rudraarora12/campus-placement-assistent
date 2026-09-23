/**
 * Recent Activity Storage Service
 * Manages placement activity logs in browser localStorage.
 */

const STORAGE_KEY_ACTIVITY = 'campus_placement_activity';

const DEFAULT_ACTIVITIES = [
  {
    id: 'act_1',
    title: 'Checked Eligibility for Adobe & Deloitte',
    description: 'Verified criteria against official Chitkara placement matrix',
    timestamp: '10 minutes ago',
    type: 'eligibility',
  },
  {
    id: 'act_2',
    title: 'Started AI Placement Conversation',
    description: 'Asked questions regarding highest packages and recruiter roles',
    timestamp: '1 hour ago',
    type: 'chat',
  },
  {
    id: 'act_3',
    title: 'Practiced DSA Topic',
    description: 'Completed Dynamic Programming pattern questions',
    timestamp: 'Yesterday',
    type: 'dsa',
  },
  {
    id: 'act_4',
    title: 'Updated Student Profile',
    description: 'Refined CGPA and academic batch information',
    timestamp: '2 days ago',
    type: 'profile',
  },
];

/**
 * Gets recent activities from localStorage.
 * @returns {Array<Object>}
 */
export function getActivities() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ACTIVITY);
    if (!data) return DEFAULT_ACTIVITIES;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load activities from localStorage:', error);
    return DEFAULT_ACTIVITIES;
  }
}

/**
 * Adds a new activity entry to localStorage.
 * @param {Object} activity
 */
export function addActivity({ title, description, type = 'general' }) {
  try {
    const activities = getActivities();
    const newEntry = {
      id: `act_${Date.now()}`,
      title,
      description,
      timestamp: 'Just now',
      type,
    };
    const updated = [newEntry, ...activities.slice(0, 15)];
    localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save activity to localStorage:', error);
    return getActivities();
  }
}
