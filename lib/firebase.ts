import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase web config is public client configuration. Environment variables can
// still override these defaults if the app is pointed at another Firebase project.
const defaultFirebaseConfig = {
  apiKey: "AIzaSyCKIgjZXEit1dF77bCyE01L9iIzGR4jWYE",
  authDomain: "hamroh-uz.firebaseapp.com",
  projectId: "hamroh-uz",
  storageBucket: "hamroh-uz.firebasestorage.app",
  messagingSenderId: "340527495202",
  appId: "1:340527495202:web:860a564d604ea2b606727b",
  measurementId: "G-S6V05EDJXC",
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || defaultFirebaseConfig.measurementId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function getFirebaseAnalytics() {
  if (typeof window === "undefined") return null;

  const { getAnalytics, isSupported } = await import("firebase/analytics");
  return (await isSupported()) ? getAnalytics(app) : null;
}

export default app;
