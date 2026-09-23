import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const LOCAL_STORAGE_USER_KEY = 'campus_placement_auth_user';

/**
 * Format Firebase / Backend Auth error codes into clear, user-friendly messages
 */
export function formatAuthError(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';
  const msg = error.message || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please provide a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 8 characters.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'Authentication service is initializing. Please verify credentials.';
    default:
      if (msg.includes('already exists')) {
        return 'This email is already registered. Please sign in instead.';
      }
      if (msg.includes('Invalid email or password')) {
        return 'Invalid email or password. Please verify your credentials.';
      }
      return msg || 'Authentication failed. Please try again.';
  }
}

/**
 * Helper to authenticate against backend API
 */
async function backendLogin({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Invalid email or password.');
  }

  const u = data.user;
  const userData = {
    uid: u._id || u.id || `usr_${Date.now()}`,
    email: u.email,
    name: u.name || 'Student',
    course: u.course || 'B.Tech',
    branch: u.branch || 'Computer Science & Engineering',
    graduationYear: u.graduationYear || '2027',
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
  return userData;
}

/**
 * Helper to register against backend API
 */
async function backendSignup({ name, email, password, course, branch, graduationYear }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password, course, branch, graduationYear }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Registration failed.');
  }

  const u = data.user;
  const userData = {
    uid: u._id || u.id || `usr_${Date.now()}`,
    email: u.email,
    name: u.name || name || 'Student',
    course: u.course || course || 'B.Tech',
    branch: u.branch || branch || 'Computer Science & Engineering',
    graduationYear: u.graduationYear || graduationYear || '2027',
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
  return userData;
}

/**
 * Register a new student account using Firebase with seamless Backend sync/fallback
 */
export async function signUp({ name, email, password, course, branch, graduationYear }) {
  let firebaseSuccess = false;
  let resultUser = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name) {
      try {
        await updateProfile(user, { displayName: name });
      } catch (_) {}
    }

    resultUser = {
      uid: user.uid,
      email: user.email,
      name: name || user.displayName || 'Student',
      course: course || 'B.Tech',
      branch: branch || 'Computer Science & Engineering',
      graduationYear: graduationYear || '2027',
    };
    firebaseSuccess = true;

    // Also register in backend store for data consistency
    try {
      await backendSignup({ name, email, password, course, branch, graduationYear });
    } catch (_) {}

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(resultUser));
    return resultUser;
  } catch (err) {
    console.warn('Firebase SignUp notice:', err.code || err.message);

    // Fallback to backend registration if Firebase authentication is not configured in project
    try {
      resultUser = await backendSignup({
        name,
        email,
        password,
        course,
        branch,
        graduationYear,
      });
      return resultUser;
    } catch (backendErr) {
      console.error('Backend SignUp Error:', backendErr);
      throw new Error(formatAuthError(backendErr));
    }
  }
}

/**
 * Authenticate existing student using Firebase with Backend fallback
 */
export async function login({ email, password }) {
  try {
    // Attempt Firebase sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || 'Student',
    };

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
    return userData;
  } catch (err) {
    console.warn('Firebase Login notice:', err.code || err.message);

    // Fallback to backend authentication (e.g. for existing registered users or when Firebase auth provider isn't activated)
    try {
      const backendUser = await backendLogin({ email, password });
      return backendUser;
    } catch (backendErr) {
      console.error('Auth Login Error:', backendErr);
      throw new Error(formatAuthError(backendErr.message ? backendErr : err));
    }
  }
}

/**
 * Sign out the currently authenticated user
 */
export async function logout() {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signOut error:', err);
  }

  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.warn('Backend logout error:', err);
  }

  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  return { success: true };
}

/**
 * Subscribe to Auth state changes (checks Firebase + Backend/LocalStorage)
 */
export function subscribeToAuthState(callback) {
  let unsubscribed = false;

  const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
    if (unsubscribed) return;

    if (firebaseUser) {
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Student',
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userData));
      callback(userData);
    } else {
      // Check backend session or saved local storage user
      try {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.email) {
            callback(parsed);
            return;
          }
        }

        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const u = data.user;
            const backendUser = {
              uid: u._id || u.id,
              email: u.email,
              name: u.name || 'Student',
              course: u.course || 'B.Tech',
              branch: u.branch || 'Computer Science & Engineering',
              graduationYear: u.graduationYear || '2027',
            };
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(backendUser));
            callback(backendUser);
            return;
          }
        }
      } catch (_) {}

      callback(null);
    }
  });

  return () => {
    unsubscribed = true;
    unsubscribeFirebase();
  };
}
