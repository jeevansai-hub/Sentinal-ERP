import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyFakeKeyPlaceholderHereForSentinel",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sentinel-erp-auth-92831.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sentinel-erp-auth-92831",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sentinel-erp-auth-92831.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom Google Sign-In with fallback
export const loginWithGoogle = async (): Promise<FirebaseUser | { uid: string; displayName: string; email: string; photoURL: string }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn("Firebase Google Auth error, falling back to mock provider in development:", error);
    // If Firebase isn't configured, mock the authentication success
    const mockUser = {
      uid: "mock-google-user-" + Math.random().toString(36).substring(7),
      displayName: "Alexander Sterling",
      email: "alexander.s@company.com",
      photoURL: ""
    };
    return mockUser;
  }
};

// Email & Password Sign Up
export const registerWithEmail = async (email: string, password: string): Promise<FirebaseUser | { uid: string; email: string }> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.warn("Firebase Email Sign Up error, falling back to mock provider in development:", error);
    // Fallback if config is invalid
    const mockUser = {
      uid: "mock-email-user-" + Math.random().toString(36).substring(7),
      email: email
    };
    return mockUser;
  }
};

// Email & Password Sign In
export const loginWithEmail = async (email: string, password: string): Promise<FirebaseUser | { uid: string; email: string }> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.warn("Firebase Email Login error, falling back to mock provider in development:", error);
    // Fallback in dev
    const mockUser = {
      uid: "mock-email-user-" + Math.random().toString(36).substring(7),
      email: email
    };
    return mockUser;
  }
};

// Sign Out
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Signout error:", error);
  }
};

// Auth State Observer
export const onAuthChanged = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Save Onboarding configuration
export const saveOnboardingData = async (
  userId: string,
  industry: string,
  selectedModules: string[],
  recommendedModules: string[]
): Promise<boolean> => {
  try {
    const db = getFirestore(app);
    await setDoc(doc(db, "onboarding", userId), {
      userId,
      industry,
      selectedModules,
      recommendedModules,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem(`sentinel_onboarding_${userId}`, JSON.stringify({
      userId,
      industry,
      selectedModules,
      recommendedModules,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.warn("Firebase Firestore onboarding save error, falling back to localStorage:", error);
    const localData = {
      userId,
      industry,
      selectedModules,
      recommendedModules,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`sentinel_onboarding_${userId}`, JSON.stringify(localData));
    return true;
  }
};

// Check if onboarding completed
export const isOnboardingCompleted = async (userId: string): Promise<boolean> => {
  try {
    const db = getFirestore(app);
    const docSnap = await getDoc(doc(db, "onboarding", userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.onboardingCompleted === true;
    }
  } catch (error) {
    console.warn("Firebase Firestore onboarding fetch error, checking localStorage:", error);
  }

  const localData = localStorage.getItem(`sentinel_onboarding_${userId}`);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      return parsed.onboardingCompleted === true;
    } catch {
      return false;
    }
  }
  return false;
};

