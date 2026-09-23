/**
 * Frontend AI Service
 * Communicates ONLY with the Node/Express backend on /api/chat.
 * Never connects directly to Azure or exposes any credentials.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

/**
 * Sends a chat message to the Express backend API.
 * @param {string} message - User query
 * @returns {Promise<{response: string}>}
 */
export async function sendMessage(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMsg = data.error || 'Failed to get response from server.';
      const err = new Error(errorMsg);
      err.details = data.details || null;
      throw err;
    }

    return {
      response: data.response,
    };
  } catch (error) {
    console.error('aiService error:', error);
    throw error;
  }
}
