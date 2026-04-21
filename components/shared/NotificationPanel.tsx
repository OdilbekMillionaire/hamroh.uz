"use client";

import { useEffect, useRef } from "react";
import { Bell, FileText, Shield, Scale, Info, CheckCheck, X } from "lucide-react";
import type { Notification } from "@/hooks/useNotifications";
import Link from "next/link";
import { useLocale } from "next-intl";

const TYPE_CONFIG: Record<Notification["type"], { Icon: React.ElementType; color: string; bg: string }> = {
  petition: { Icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  security: { Icon: Shield, color: "text-orange-600", bg: "bg-orange-50" },
  legal:    { Icon: Scale,   color: "text-[#0E6E7E]", bg: "bg-[#E8F4F6]" },
  system:   { Icon: Info,    color: "text-gray-600",  bg: "bg-gray-50" },
};

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface Props {
  notifications: Notification[];
  unreadCount: number;
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
}

export default function NotificationPanel({ notifications, unreadCount, onClose, onMarkAllRead, onMarkRead }: Props) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#D8E2E9] rounded-2xl shadow-xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D8E2E9]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#0E6E7E]" />
          <span className="font-bold text-sm text-[#1A2733]">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-[#0E6E7E] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs text-[#0E6E7E] hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-[#8FA5B5] hover:text-[#1A2733]">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-[#F0F4F7]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#8FA5B5]">
            <Bell className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs mt-1">You&apos;ll see updates here</p>
          </div>
        ) : (
          notifications.map((n) => {
            const cfg = TYPE_CONFIG[n.type];
            const content = (
              <div
                className={`flex gap-3 px-4 py-3 hover:bg-[#F7F9FA] transition-colors cursor-pointer ${!n.read ? "bg-[#F0F7F8]" : ""}`}
                onClick={() => { if (!n.read) void onMarkRead(n.id); }}
              >
                <div className={`w-8 h-8 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}>
                  <cfg.Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${!n.read ? "font-semibold text-[#1A2733]" : "font-medium text-[#4A6274]"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-[#8FA5B5] mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-xs text-[#B0C4CE] mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && <span className="w-2 h-2 bg-[#0E6E7E] rounded-full mt-2 shrink-0" />}
              </div>
            );

            return n.href ? (
              <Link key={n.id} href={`/${locale}${n.href}`} onClick={() => { if (!n.read) void onMarkRead(n.id); }}>
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-[#D8E2E9] text-center">
          <Link href={`/${locale}/profile`} onClick={onClose} className="text-xs text-[#0E6E7E] hover:underline font-medium">
            Manage notification settings →
          </Link>
        </div>
      )}
    </div>
  );
}
