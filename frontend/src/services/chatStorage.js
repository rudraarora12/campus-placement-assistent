/**
 * Chat Storage Service
 * Manages conversation history in browser localStorage for Campus Placement Assistant.
 * Keeps all client-side state clean and isolated.
 */

const STORAGE_KEY_HISTORY = 'campus_placement_chat_history';
const STORAGE_KEY_ACTIVE = 'campus_placement_active_chat';

/**
 * Generates a unique ID.
 * @returns {string}
 */
export function generateUniqueId() {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Automatically creates a concise 2-5 word title based on the first user message.
 * @param {string} text - First message text
 * @returns {string}
 */
export function generateChatTitle(text) {
  if (!text || typeof text !== 'string') return 'New Chat';

  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // Common placement topic pattern matchers
  if (lower.includes('eligible') || lower.includes('eligibility') || lower.includes('criteria')) {
    if (lower.includes('cgpa')) return 'CGPA & Eligibility Check';
    if (lower.includes('backlog')) return 'Backlog Eligibility Rules';
    return 'Placement Eligibility';
  }
  if (lower.includes('package') || lower.includes('salary') || lower.includes('ctc') || lower.includes('highest')) {
    if (lower.includes('highest')) return 'Highest Package Details';
    if (lower.includes('average') || lower.includes('median')) return 'Average & Median CTC';
    return 'Salary & Package Details';
  }
  if (lower.includes('interview') || lower.includes('round') || lower.includes('hr') || lower.includes('technical')) {
    return 'Interview Preparation';
  }
  if (lower.includes('dsa') || lower.includes('leetcode') || lower.includes('algorithm') || lower.includes('structure')) {
    return 'DSA Preparation Plan';
  }
  if (lower.includes('resume') || lower.includes('cv') || lower.includes('portfolio')) {
    return 'Resume Optimization';
  }
  if (lower.includes('aptitude') || lower.includes('quant') || lower.includes('logical')) {
    return 'Aptitude Assessment';
  }
  if (lower.includes('amazon') || lower.includes('google') || lower.includes('microsoft') || lower.includes('adobe') || lower.includes('deloitte')) {
    const match = cleanText.match(/(amazon|google|microsoft|adobe|deloitte|ibm|accenture|infosys|wipro|cognizant|tcs)/i);
    if (match) {
      const company = match[0].charAt(0).toUpperCase() + match[0].slice(1);
      return `${company} Placement Info`;
    }
  }

  // Fallback: Take the first 3-5 words without punctuation
  const words = cleanText
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return 'New Chat';

  const selectedWords = words.slice(0, Math.min(words.length, 4));
  const title = selectedWords.join(' ');
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/**
 * Retrieves all stored conversations from localStorage.
 * @returns {Array<Object>}
 */
export function getConversations() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load conversations from localStorage:', error);
    return [];
  }
}

/**
 * Persists conversations array to localStorage.
 * @param {Array<Object>} conversations
 */
export function saveConversations(conversations) {
  try {
    if (!Array.isArray(conversations)) return;
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Failed to save conversations to localStorage:', error);
  }
}

/**
 * Creates and stores a new conversation.
 * @param {string} [initialTitle='New Chat']
 * @returns {Object} The created conversation object
 */
export function createConversation(initialTitle = 'New Chat') {
  const newConversation = {
    id: `conv_${generateUniqueId()}`,
    title: initialTitle,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };

  const conversations = getConversations();
  const updatedList = [newConversation, ...conversations];
  saveConversations(updatedList);
  setActiveConversationId(newConversation.id);

  return newConversation;
}

/**
 * Finds a specific conversation by ID.
 * @param {string} conversationId
 * @returns {Object|null}
 */
export function getConversation(conversationId) {
  const conversations = getConversations();
  return conversations.find((c) => c.id === conversationId) || null;
}

/**
 * Updates a conversation by ID with new data or an update function.
 * @param {string} conversationId
 * @param {Object|Function} updater
 * @returns {Array<Object>} Updated conversations list
 */
export function updateConversation(conversationId, updater) {
  const conversations = getConversations();
  const index = conversations.findIndex((c) => c.id === conversationId);

  if (index === -1) return conversations;

  const current = conversations[index];
  const updated =
    typeof updater === 'function'
      ? updater(current)
      : { ...current, ...updater, updatedAt: new Date().toISOString() };

  // Move updated conversation to top of list if messages changed
  conversations.splice(index, 1);
  const updatedList = [updated, ...conversations];

  saveConversations(updatedList);
  return updatedList;
}

/**
 * Deletes a conversation by ID from localStorage.
 * @param {string} conversationId
 * @returns {Array<Object>} Remaining conversations list
 */
export function deleteConversation(conversationId) {
  const conversations = getConversations();
  const filtered = conversations.filter((c) => c.id !== conversationId);
  saveConversations(filtered);

  if (getActiveConversationId() === conversationId) {
    const nextActive = filtered.length > 0 ? filtered[0].id : null;
    setActiveConversationId(nextActive);
  }

  return filtered;
}

/**
 * Sets the active conversation ID in localStorage.
 * @param {string|null} conversationId
 */
export function setActiveConversationId(conversationId) {
  try {
    if (conversationId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE, conversationId);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
    }
  } catch (error) {
    console.error('Failed to set active conversation in localStorage:', error);
  }
}

/**
 * Gets the active conversation ID from localStorage.
 * @returns {string|null}
 */
export function getActiveConversationId() {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE);
  } catch (error) {
    console.error('Failed to get active conversation from localStorage:', error);
    return null;
  }
}

/**
 * Groups conversations by time periods: "Today", "Yesterday", "Previous 7 Days", "Older".
 * @param {Array<Object>} conversations
 * @returns {Object<string, Array<Object>>}
 */
export function groupConversationsByDate(conversations) {
  const groups = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Older: [],
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const sevenDaysAgoStart = todayStart - 7 * 86400000;

  for (const conv of conversations) {
    const convTime = new Date(conv.updatedAt || conv.createdAt).getTime();

    if (convTime >= todayStart) {
      groups.Today.push(conv);
    } else if (convTime >= yesterdayStart) {
      groups.Yesterday.push(conv);
    } else if (convTime >= sevenDaysAgoStart) {
      groups['Previous 7 Days'].push(conv);
    } else {
      groups.Older.push(conv);
    }
  }

  return groups;
}
