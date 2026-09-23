import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickPrompts from './QuickPrompts';

const CAPABILITIES = [
  { icon: '🎯', label: 'Placement Eligibility' },
  { icon: '💡', label: 'Interview Preparation' },
  { icon: '💻', label: 'DSA Preparation' },
  { icon: '📝', label: 'Resume Guidance' },
  { icon: '📈', label: 'Aptitude Preparation' },
  { icon: '🏛️', label: 'Campus Placement Q&A' },
];

export default function ChatWindow({
  messages,
  input,
  setInput,
  onSendMessage,
  isLoading,
  error,
  onRetry,
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, error]);

  const hasMessages = messages.length > 0;

  return (
    <main className="chat-container">
      <div className="messages-area">
        {!hasMessages ? (
          <div className="hero-container">
            <div className="hero-badge">AI Placement Assistant</div>
            <h1 className="hero-title">Your Campus Placement AI Agent</h1>
            <p className="hero-subtitle">
              Ask questions about campus placements, eligibility, interviews, DSA,
              resumes and aptitude preparation.
            </p>

            <QuickPrompts
              onSelectPrompt={onSendMessage}
              disabled={isLoading}
            />

            <div className="capabilities-container">
              <div className="quick-prompts-header" style={{ marginBottom: '0.5rem' }}>
                Key Capabilities
              </div>
              <div className="capabilities-grid">
                {CAPABILITIES.map((cap, idx) => (
                  <div key={idx} className="capability-item">
                    <span className="capability-icon">{cap.icon}</span>
                    <span>{cap.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}

            {isLoading && (
              <div className="message-wrapper message-ai">
                <div className="message-bubble-wrapper">
                  <div className="message-avatar avatar-ai">AI</div>
                  <div className="loading-indicator-container">
                    <div className="typing-dots">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                    <span>Campus Placement Assistant is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="error-banner">
                <div className="error-text-container">
                  <div className="error-title">Something went wrong. Please try again.</div>
                  {error.details && (
                    <div className="error-details">{error.details}</div>
                  )}
                </div>
                {onRetry && (
                  <button type="button" className="retry-button" onClick={onRetry}>
                    Retry
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={() => onSendMessage(input)}
        isLoading={isLoading}
      />
    </main>
  );
}
