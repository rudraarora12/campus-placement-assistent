import React, { useRef, useEffect } from 'react';

export default function ChatInput({ input, setInput, onSend, isLoading }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="input-section">
      <div className="input-container">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          rows={1}
          placeholder="Ask anything about campus placements..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div className="chat-actions">
          <button
            type="button"
            className="send-button"
            disabled={isLoading || !input.trim()}
            onClick={onSend}
            title="Send Message (Enter)"
            aria-label="Send message"
          >
            <svg
              className="send-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <div className="input-hints">
        <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for a new line</span>
        <span>Powered by Microsoft Foundry Agent</span>
      </div>
    </div>
  );
}
