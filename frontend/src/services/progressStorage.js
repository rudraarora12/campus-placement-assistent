/**
 * Preparation Progress Storage Service
 * Manages placement preparation checklist and progress in browser localStorage.
 */

const STORAGE_KEY_PROGRESS = 'campus_placement_progress';

const DEFAULT_PROGRESS = {
  readinessPercentage: 72,
  completedTopicsCount: 14,
  totalTopicsCount: 20,
  categories: [
    { id: 'aptitude', name: 'Aptitude & Reasoning', progress: 75, completed: 6, total: 8, icon: '📈' },
    { id: 'dsa', name: 'DSA & Algorithms', progress: 70, completed: 14, total: 20, icon: '💻' },
    { id: 'technical', name: 'Technical CS Core', progress: 65, completed: 5, total: 8, icon: '⚙️' },
    { id: 'hr', name: 'HR & Behavioral', progress: 80, completed: 4, total: 5, icon: '🎯' },
    { id: 'resume', name: 'Resume & Projects', progress: 90, completed: 9, total: 10, icon: '📄' },
    { id: 'communication', name: 'Communication & GD', progress: 60, completed: 3, total: 5, icon: '🗣️' },
  ],
};

/**
 * Gets preparation progress from localStorage or default.
 * @returns {Object}
 */
export function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!data) return DEFAULT_PROGRESS;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
    return DEFAULT_PROGRESS;
  }
}

/**
 * Saves preparation progress to localStorage.
 * @param {Object} progress
 */
export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
  }
}

/**
 * Updates a specific category's progress.
 * @param {string} categoryId
 * @param {number} deltaCompleted
 */
export function updateCategoryProgress(categoryId, deltaCompleted) {
  const current = getProgress();
  const category = current.categories.find((c) => c.id === categoryId);
  if (!category) return current;

  category.completed = Math.max(0, Math.min(category.total, category.completed + deltaCompleted));
  category.progress = Math.round((category.completed / category.total) * 100);

  // Recalculate global readiness
  let totalCompleted = 0;
  let totalCount = 0;
  for (const c of current.categories) {
    totalCompleted += c.completed;
    totalCount += c.total;
  }

  current.completedTopicsCount = totalCompleted;
  current.totalTopicsCount = totalCount;
  current.readinessPercentage = Math.round((totalCompleted / totalCount) * 100);

  saveProgress(current);
  return current;
}
