"use client";

import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  displayName: string;
  phone: string;
  email: string;
  country: string;
  countryFlag: string;
  preferredLocale: string;
  activePetitions: number;
  resolvedPetitions: number;
  savedContent: number;
  notifications: {
    petitionUpdates: boolean;
    legalNews: boolean;
    aiTips: boolean;
    emergencyAlerts: boolean;
  };
  createdAt: unknown;
}

const DEFAULT_PROFILE: Omit<UserProfile, "uid" | "createdAt"> = {
  displayName: "",
  phone: "",
  email: "",
  country: "",
  countryFlag: "🌍",
  preferredLocale: "uz",
  activePetitions: 0,
  resolvedPetitions: 0,
  savedContent: 0,
  notifications: {
    petitionUpdates: true,
    legalNews: true,
    aiTips: false,
    emergencyAlerts: true,
  },
};

export function useUserProfile(uid: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setProfile(null); setLoading(false); return; }
    const ref = doc(db, "users", uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        setProfile({ ...DEFAULT_PROFILE, uid, createdAt: null });
      }
    }).catch(() => {
      setProfile({ ...DEFAULT_PROFILE, uid, createdAt: null });
    }).finally(() => setLoading(false));
  }, [uid]);

  const save = useCallback(async (updates: Partial<UserProfile>) => {
    if (!uid) return;
    const ref = doc(db, "users", uid);
    const updated = { ...profile, ...updates, uid, updatedAt: serverTimestamp() };
    await setDoc(ref, updated, { merge: true });
    setProfile((prev) => prev ? { ...prev, ...updates } : null);
  }, [uid, profile]);

  return { profile, loading, save };
}
