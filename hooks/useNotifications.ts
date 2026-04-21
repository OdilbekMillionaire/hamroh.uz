"use client";

import { useEffect, useState } from "react";
import {
  collection, query, where, orderBy, limit,
  onSnapshot, updateDoc, doc, addDoc, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "petition" | "security" | "legal" | "system";
  read: boolean;
  createdAt: Date;
  href?: string;
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Notification[] = snap.docs.map((d) => {
          const data = d.data();
          const ts = data.createdAt as Timestamp | null;
          return {
            id: d.id,
            title: data.title as string,
            body: data.body as string,
            type: data.type as Notification["type"],
            read: data.read as boolean,
            createdAt: ts ? ts.toDate() : new Date(),
            href: data.href as string | undefined,
          };
        });
        setNotifications(items);
        setLoading(false);
      },
      () => {
        // Index not yet created or permission denied — show empty gracefully
        setNotifications([]);
        setLoading(false);
      }
    );

    return unsub;
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) => updateDoc(doc(db, "notifications", n.id), { read: true }))
    );
  }

  async function markRead(id: string) {
    await updateDoc(doc(db, "notifications", id), { read: true });
  }

  return { notifications, loading, unreadCount, markAllRead, markRead };
}

// Call this from server/API routes or after petition actions
export async function createNotification(
  userId: string,
  notification: Omit<Notification, "id" | "read" | "createdAt">
) {
  await addDoc(collection(db, "notifications"), {
    userId,
    ...notification,
    read: false,
    createdAt: serverTimestamp(),
  });
}
