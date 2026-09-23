import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ProfileView from './components/ProfileView';
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

function PlacementPlatform({ defaultView = 'chat' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation View State
  const [currentView, setCurrentView] = useState(defaultView);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(true);

  // Stored State
  const [profile, setProfileState] = useState(getProfile());
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

  // Sync profile when auth user updates
  useEffect(() => {
    if (user) {
      setProfileState((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        course: user.course || prev.course,
        branch: user.branch || prev.branch,
        graduationYear: user.graduationYear || prev.graduationYear,
      }));
    }
  }, [user]);

  // Handle internal navigation
  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    if (viewId === 'chat') {
      navigate('/assistant');
    } else if (viewId === 'profile') {
      navigate('/profile');
    }
  };

  // Sync view when path changes
  useEffect(() => {
    if (location.pathname === '/profile') {
      setCurrentView('profile');
    } else {
      setCurrentView('chat');
    }
  }, [location.pathname]);

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
    handleNavigate('chat');
  };

  // Select an existing conversation
  const handleSelectConversation = (convId) => {
    setActiveId(convId);
    setActiveConversationId(convId);
    setError(null);
    setLastFailedMessage(null);
    handleNavigate('chat');
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

    const isFirstMessage =
      !currentConv.messages ||
      currentConv.messages.length === 0 ||
      currentConv.title === 'New Chat';
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
        onToggleSidebar={() => setIsChatSidebarOpen((prev) => !prev)}
        onNavigate={handleNavigate}
      />

      <div className="main-layout chat-layout-inner" style={{ flex: 1, overflow: 'hidden' }}>
        {currentView === 'profile' ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            <ProfileView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              onBackToChat={() => handleNavigate('chat')}
            />
          </div>
        ) : (
          <>
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
          </>
        )}
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
                <strong>Security & Privacy:</strong> All conversation histories and student prep
                records are stored safely in your browser session.
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Protected Main Routes */}
          <Route
            path="/assistant"
            element={
              <ProtectedRoute>
                <PlacementPlatform defaultView="chat" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PlacementPlatform defaultView="profile" />
              </ProtectedRoute>
            }
          />

          {/* Redirect /dashboard and root to /assistant */}
          <Route path="/dashboard" element={<Navigate to="/assistant" replace />} />
          <Route path="/" element={<Navigate to="/assistant" replace />} />
          <Route path="*" element={<Navigate to="/assistant" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
