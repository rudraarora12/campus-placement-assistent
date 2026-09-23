import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user' || message.sender === 'user';
  const textContent = message.content !== undefined ? message.content : (message.text || '');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`message-wrapper ${isUser ? 'message-user' : 'message-ai'}`}>
      <div className="message-bubble-wrapper">
        <div className={`message-avatar ${isUser ? 'avatar-user' : 'avatar-ai'}`}>
          {isUser ? 'U' : 'AI'}
        </div>

        <div className="message-bubble">
          {isUser ? (
            <p style={{ whiteSpace: 'pre-wrap' }}>{textContent}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {textContent}
            </ReactMarkdown>
          )}
        </div>
      </div>

      <div className="message-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {!isUser && (
          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.725rem',
              padding: '0 4px',
            }}
            title="Copy message"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}
