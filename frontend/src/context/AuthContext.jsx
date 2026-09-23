import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { getProfile, saveProfile } from '../services/profileStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync profile storage with authenticated user
  const syncProfile = (authUser) => {
    if (!authUser) return;
    const currentProfile = getProfile() || {};
    const updated = {
      ...currentProfile,
      uid: authUser.uid,
      name: authUser.name || authUser.displayName || currentProfile.name || 'Student',
      email: authUser.email || currentProfile.email || '',
      course: authUser.course || currentProfile.course || 'B.Tech',
      branch: authUser.branch || currentProfile.branch || 'Computer Science & Engineering',
      graduationYear: authUser.graduationYear || currentProfile.graduationYear || '2027',
    };
    saveProfile(updated);
  };

  // Listen to Auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthState((authUser) => {
      if (authUser) {
        const currentProfile = getProfile() || {};
        const userData = {
          uid: authUser.uid,
          email: authUser.email,
          name: authUser.name || authUser.displayName || currentProfile.name || 'Student',
          course: authUser.course || currentProfile.course || 'B.Tech',
          branch: authUser.branch || currentProfile.branch || 'Computer Science & Engineering',
          graduationYear: authUser.graduationYear || currentProfile.graduationYear || '2027',
        };
        setUser(userData);
        syncProfile(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    const loggedUser = await authService.login({ email, password });
    const currentProfile = getProfile() || {};
    const userData = {
      ...loggedUser,
      name: loggedUser.name || currentProfile.name || 'Student',
      course: loggedUser.course || currentProfile.course || 'B.Tech',
      branch: loggedUser.branch || currentProfile.branch || 'Computer Science & Engineering',
      graduationYear: loggedUser.graduationYear || currentProfile.graduationYear || '2027',
    };
    setUser(userData);
    syncProfile(userData);
    return userData;
  };

  const signup = async (formData) => {
    const newUser = await authService.signUp(formData);
    setUser(newUser);
    syncProfile(newUser);
    return newUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
