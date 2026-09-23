import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MainSidebar from './components/MainSidebar';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import DashboardView from './components/DashboardView';
import ProfileView from './components/ProfileView';
import EligibilityView from './components/EligibilityView';
import InterviewPrepView from './components/InterviewPrepView';
import DsaPrepView from './components/DsaPrepView';
import ResumeAssistantView from './components/ResumeAssistantView';
import HistoryView from './components/HistoryView';
import { sendMessage } from './services/aiService';
import {
  getConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  getActiveConversationId,
  setActiveConversationId,
  generateChatTitle,
  generateUniqueId,
} from './services/chatStorage';
import { getProfile, saveProfile } from './services/profileStorage';
import { getProgress, updateCategoryProgress } from './services/progressStorage';
import { getActivities, addActivity } from './services/activityStorage';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(true);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(true);

  // Stored State
  const [profile, setProfileState] = useState(getProfile());
  const [progress, setProgressState] = useState(getProgress());
  const [activities, setActivitiesState] = useState(getActivities());
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveId] = useState(null);

  // Chat input / loading state
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  // Modals
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCapabilitiesOpen, setIsCapabilitiesOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedConversations = getConversations();
    setConversations(loadedConversations);

    const savedActiveId = getActiveConversationId();
    if (savedActiveId && loadedConversations.some((c) => c.id === savedActiveId)) {
      setActiveId(savedActiveId);
    } else if (loadedConversations.length > 0) {
      setActiveId(loadedConversations[0].id);
      setActiveConversationId(loadedConversations[0].id);
    } else {
      const fresh = createConversation('New Chat');
      setConversations([fresh]);
      setActiveId(fresh.id);
    }
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;
  const messages = activeConversation ? activeConversation.messages : [];

  // Update Profile
  const handleSaveProfile = (updatedProfile) => {
    saveProfile(updatedProfile);
    setProfileState(updatedProfile);
    const updatedActs = addActivity({
      title: 'Updated Student Profile',
      description: `CGPA set to ${updatedProfile.cgpa || 'N/A'}, batch ${updatedProfile.graduationYear || '2027'}`,
      type: 'profile',
    });
    setActivitiesState(updatedActs);
  };

  // Update Category Progress
  const handleUpdateCategoryProgress = (categoryId, delta) => {
    const updated = updateCategoryProgress(categoryId, delta);
    setProgressState({ ...updated });
    const category = updated.categories.find((c) => c.id === categoryId);
    if (category) {
      const updatedActs = addActivity({
        title: `Updated ${category.name} Progress`,
        description: `${category.completed}/${category.total} topics completed`,
        type: 'progress',
      });
      setActivitiesState(updatedActs);
    }
  };

  // Start a new chat
  const handleNewChat = () => {
    const newConv = createConversation('New Chat');
    const updated = getConversations();
    setConversations(updated);
    setActiveId(newConv.id);
    setActiveConversationId(newConv.id);
    setInput('');
    setError(null);
    setLastFailedMessage(null);
    setCurrentView('chat');

    const updatedActs = addActivity({
      title: 'Started a New AI Conversation',
      description: 'Initialized new placement query session',
      type: 'chat',
    });
    setActivitiesState(updatedActs);
  };

  // Select an existing conversation
  const handleSelectConversation = (convId) => {
    setActiveId(convId);
    setActiveConversationId(convId);
    setError(null);
    setLastFailedMessage(null);
    setCurrentView('chat');
  };

  // Delete a conversation
  const handleDeleteConversation = (convId) => {
    const updated = deleteConversation(convId);
    setConversations(updated);

    if (activeConversationId === convId) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
        setActiveConversationId(updated[0].id);
      } else {
        const fresh = createConversation('New Chat');
        setConversations([fresh]);
        setActiveId(fresh.id);
      }
    }
    setError(null);
    setLastFailedMessage(null);
  };

  // Send a chat message
  const handleSendMessage = async (textToSend) => {
    const messageText = typeof textToSend === 'string' ? textToSend.trim() : input.trim();
    if (!messageText || isLoading) return;

    let targetConvId = activeConversationId;
    let currentConv = activeConversation;

    if (!targetConvId || !currentConv) {
      const fresh = createConversation('New Chat');
      targetConvId = fresh.id;
      currentConv = fresh;
      setActiveId(fresh.id);
    }

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage = {
      id: `msg_${generateUniqueId()}`,
      role: 'user',
      content: messageText,
      timestamp,
    };

    const isFirstMessage = !currentConv.messages || currentConv.messages.length === 0 || currentConv.title === 'New Chat';
    const newTitle = isFirstMessage ? generateChatTitle(messageText) : currentConv.title;

    // Immediately update conversation in localStorage & state
    const updatedConversationsWithUser = updateConversation(targetConvId, (conv) => ({
      ...conv,
      title: newTitle,
      updatedAt: new Date().toISOString(),
      messages: [...(conv.messages || []), userMessage],
    }));

    setConversations(updatedConversationsWithUser);
    setInput('');
    setIsLoading(true);
    setError(null);
    setLastFailedMessage(messageText);

    try {
      const data = await sendMessage(messageText);

      const aiMessage = {
        id: `msg_${generateUniqueId()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      const updatedConversationsWithAI = updateConversation(targetConvId, (conv) => ({
        ...conv,
        updatedAt: new Date().toISOString(),
        messages: [...(conv.messages || []), aiMessage],
      }));

      setConversations(updatedConversationsWithAI);
      setLastFailedMessage(null);

      // Log activity
      const updatedActs = addActivity({
        title: `AI Question: "${newTitle}"`,
        description: `Verified answer retrieved from placement knowledge base`,
        type: 'chat',
      });
      setActivitiesState(updatedActs);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError({
        message: err.message || 'Something went wrong. Please try again.',
        details: err.details || null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Launch AI with specific prompt from any view
  const handleAskAIWithPrompt = (promptText) => {
    setCurrentView('chat');
    handleSendMessage(promptText);
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        profile={profile}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenCapabilities={() => setIsCapabilitiesOpen(true)}
        onToggleSidebar={() => setIsMainSidebarOpen((prev) => !prev)}
        onNavigate={setCurrentView}
      />

      <div className="platform-layout">
        {/* Main Application Sidebar */}
        <MainSidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          isOpen={isMainSidebarOpen}
          onClose={() => setIsMainSidebarOpen(false)}
        />

        {/* View Router Area */}
        <div className="platform-view-area">
          {currentView === 'dashboard' && (
            <DashboardView
              profile={profile}
              conversations={conversations}
              progress={progress}
              activities={activities}
              onOpenChat={() => setCurrentView('chat')}
              onOpenChatWithConversation={(id) => handleSelectConversation(id)}
              onAskAI={handleAskAIWithPrompt}
              onNavigate={setCurrentView}
              onUpdateCategoryProgress={handleUpdateCategoryProgress}
            />
          )}

          {currentView === 'chat' && (
            <div className="main-layout chat-layout-inner">
              <Sidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleNewChat}
                onDeleteConversation={handleDeleteConversation}
                isOpen={isChatSidebarOpen}
                onCloseSidebar={() => setIsChatSidebarOpen(false)}
              />

              <ChatWindow
                messages={messages}
                input={input}
                setInput={setInput}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                error={error}
                onRetry={lastFailedMessage ? handleRetry : null}
              />
            </div>
          )}

          {currentView === 'history' && (
            <HistoryView
              conversations={conversations}
              onOpenConversation={(id) => handleSelectConversation(id)}
              onNewChat={handleNewChat}
              onDeleteConversation={handleDeleteConversation}
            />
          )}

          {currentView === 'eligibility' && (
            <EligibilityView
              profile={profile}
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentView === 'interview' && (
            <InterviewPrepView
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentView === 'dsa' && (
            <DsaPrepView
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentView === 'resume' && (
            <ResumeAssistantView
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              profile={profile}
              onSaveProfile={handleSaveProfile}
            />
          )}

          {currentView === 'settings' && (
            <div className="view-container">
              <div className="view-header">
                <h1 className="view-title">Settings & Platform Status</h1>
                <p className="view-subtitle">Manage browser storage and inspect connected Foundry Agent details.</p>
              </div>
              <div className="settings-cards-grid">
                <div className="settings-card">
                  <h3 className="settings-card-title">Microsoft Foundry Agent</h3>
                  <div className="settings-key-val">
                    <span>Agent Name:</span>
                    <code>Campus-Placement-Assistant</code>
                  </div>
                  <div className="settings-key-val">
                    <span>Agent Version:</span>
                    <code>23</code>
                  </div>
                  <div className="settings-key-val">
                    <span>Model:</span>
                    <code>gpt-4.1-mini</code>
                  </div>
                  <div className="settings-key-val">
                    <span>Knowledge Source:</span>
                    <code>File Search (Official PDF Documents)</code>
                  </div>
                </div>

                <div className="settings-card">
                  <h3 className="settings-card-title">Browser LocalStorage</h3>
                  <div className="settings-key-val">
                    <span>Saved Conversations:</span>
                    <strong>{conversations.length}</strong>
                  </div>
                  <div className="settings-key-val">
                    <span>Student Profile:</span>
                    <strong>{profile.name || 'Set'}</strong>
                  </div>
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => {
                      if (window.confirm('Clear all conversation history stored in localStorage?')) {
                        localStorage.removeItem('campus_placement_chat_history');
                        localStorage.removeItem('campus_placement_active_chat');
                        const fresh = createConversation('New Chat');
                        setConversations([fresh]);
                        setActiveId(fresh.id);
                        alert('Chat history cleared.');
                      }
                    }}
                  >
                    Clear Chat History
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="modal-overlay" onClick={() => setIsAboutOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">About Campus Placement Assistant</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsAboutOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <p>
                <strong>Campus Placement Assistant</strong> is a specialized AI platform designed
                for college students preparing for campus recruitment drives, technical interviews,
                DSA assessments, and eligibility checks.
              </p>
              <p>
                <strong>Engine:</strong> Connected to Microsoft Foundry Agent{' '}
                <span className="model-tag">Campus-Placement-Assistant (v23)</span> powered by{' '}
                <span className="model-tag">gpt-4.1-mini</span> with built-in File Search knowledge.
              </p>
              <p>
                <strong>Security & Privacy:</strong> All conversation histories and student profile
                data are stored safely and privately in your browser's local storage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Capabilities Modal */}
      {isCapabilitiesOpen && (
        <div className="modal-overlay" onClick={() => setIsCapabilitiesOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Agent Capabilities</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsCapabilitiesOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <ul>
                <li>
                  <strong>Placement Eligibility:</strong> Understand CGPA criteria, backlog
                  policies, and academic eligibility requirements.
                </li>
                <li>
                  <strong>Recruiter Details:</strong> Information about visiting companies, roles,
                  packages (CTC), and locations.
                </li>
                <li>
                  <strong>Technical & HR Interview Preparation:</strong> Step-by-step guidance
                  for technical rounds, core CS subjects, behavioral questions, and HR rounds.
                </li>
                <li>
                  <strong>DSA Preparation Plans:</strong> Tailored study roadmaps covering Data
                  Structures & Algorithms and LeetCode patterns.
                </li>
                <li>
                  <strong>Resume Optimization:</strong> Bullet points structuring, action verbs,
                  technical skills grouping, and project presentation.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
