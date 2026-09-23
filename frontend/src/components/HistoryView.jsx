import React, { useState } from 'react';
import { History, MessageSquare, Trash2, ArrowRight, Search, Plus } from 'lucide-react';

export default function HistoryView({
  conversations,
  onOpenConversation,
  onNewChat,
  onDeleteConversation,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = conversations.filter((c) => {
    const titleMatch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const messageMatch = (c.messages || []).some((m) =>
      (m.content || m.text || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    return titleMatch || messageMatch;
  });

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-icon-badge history-badge">
          <History className="view-header-icon" />
        </div>
        <div className="view-header-flex">
          <div>
            <h1 className="view-title">Conversation History</h1>
            <p className="view-subtitle">
              All previous placement chats stored safely in your browser's local storage.
            </p>
          </div>
          <button type="button" className="new-chat-top-btn" onClick={onNewChat}>
            <Plus className="btn-icon" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="history-search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search previous conversations by topic or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchTerm('')}
          >
            Clear
          </button>
        )}
      </div>

      {/* Conversation List Grid */}
      <div className="history-grid-container">
        {filtered.length === 0 ? (
          <div className="empty-history-box">
            <MessageSquare className="empty-icon" />
            <h3>No conversations found</h3>
            <p>
              {searchTerm
                ? 'No chats matched your search query.'
                : 'You have not started any AI conversations yet.'}
            </p>
            <button type="button" className="primary-action-btn" onClick={onNewChat}>
              Start New Chat →
            </button>
          </div>
        ) : (
          <div className="history-cards-grid">
            {filtered.map((conv) => {
              const msgCount = conv.messages ? conv.messages.length : 0;
              const firstUserMsg = (conv.messages || []).find(
                (m) => m.role === 'user' || m.sender === 'user'
              );
              const preview = firstUserMsg
                ? (firstUserMsg.content || firstUserMsg.text || '').substring(0, 100) + '...'
                : 'No messages yet';

              const formattedDate = new Date(conv.updatedAt || conv.createdAt).toLocaleDateString(
                undefined,
                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              );

              return (
                <div key={conv.id} className="history-card">
                  <div className="history-card-header">
                    <div className="history-card-title-wrap">
                      <MessageSquare className="chat-mini-icon" />
                      <h3 className="history-card-title">{conv.title || 'New Chat'}</h3>
                    </div>
                    <button
                      type="button"
                      className="history-card-del-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${conv.title || 'this chat'}"?`)) {
                          onDeleteConversation(conv.id);
                        }
                      }}
                      title="Delete conversation"
                    >
                      <Trash2 className="del-icon" />
                    </button>
                  </div>

                  <p className="history-card-preview">"{preview}"</p>

                  <div className="history-card-footer">
                    <span className="history-meta">
                      {msgCount} messages • {formattedDate}
                    </span>
                    <button
                      type="button"
                      className="history-open-btn"
                      onClick={() => onOpenConversation(conv.id)}
                    >
                      <span>Open Chat</span>
                      <ArrowRight className="arrow-icon" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
