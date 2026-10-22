import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCZbPcZ3rWteZYSUNO5VeLHVNfT-kQv6sU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "scaleastra-prod.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "scaleastra-prod",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "scaleastra-prod.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "444596951600",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:444596951600:web:b8a7331fab0e19fa246bf5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Y7B7WQL8EV"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Optional Analytics (only initializes in supported browser contexts)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Non-blocking catch
  });
}

export default app;
