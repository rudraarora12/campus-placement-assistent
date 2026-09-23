import React from 'react';
import { groupConversationsByDate } from '../services/chatStorage';

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpen,
  onCloseSidebar,
}) {
  const grouped = groupConversationsByDate(conversations);

  const handleDelete = (e, convId) => {
    e.stopPropagation();
    onDeleteConversation(convId);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header & New Chat Button */}
        <div className="sidebar-header">
          <button
            type="button"
            className="new-chat-btn"
            onClick={onNewChat}
            title="Start a new conversation"
          >
            <span className="new-chat-icon" aria-hidden="true">
              +
            </span>
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="sidebar-content">
          {conversations.length === 0 ? (
            <div className="sidebar-empty-state">
              <span className="empty-icon">💬</span>
              <p>No chat history yet</p>
              <span className="empty-hint">Start a new chat to see it here.</span>
            </div>
          ) : (
            Object.entries(grouped).map(([period, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={period} className="history-group">
                  <div className="history-group-title">{period}</div>
                  <div className="history-group-list">
                    {items.map((conv) => {
                      const isActive = conv.id === activeConversationId;

                      return (
                        <div
                          key={conv.id}
                          className={`history-item ${isActive ? 'active' : ''}`}
                          onClick={() => onSelectConversation(conv.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              onSelectConversation(conv.id);
                            }
                          }}
                        >
                          <span className="history-item-icon" aria-hidden="true">
                            🗨️
                          </span>
                          <span className="history-item-title" title={conv.title}>
                            {conv.title || 'New Chat'}
                          </span>
                          <button
                            type="button"
                            className="history-delete-btn"
                            onClick={(e) => handleDelete(e, conv.id)}
                            title="Delete chat"
                            aria-label={`Delete chat ${conv.title}`}
                          >
                            <svg
                              className="trash-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer info */}
        <div className="sidebar-footer">
          <div className="storage-badge">
            <span className="storage-dot"></span>
            <span>Saved in localStorage</span>
          </div>
        </div>
      </aside>
    </>
  );
}
