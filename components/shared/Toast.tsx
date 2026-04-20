"use client";

import { useToastStore } from "@/store/toastStore";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: "bg-white border-l-4 border-[#2ECC71] text-[#1A2733]",
  error: "bg-white border-l-4 border-[#E74C3C] text-[#1A2733]",
  info: "bg-white border-l-4 border-[#0E6E7E] text-[#1A2733]",
  warning: "bg-white border-l-4 border-[#F39C12] text-[#1A2733]",
};

const ICON_COLORS = {
  success: "text-[#2ECC71]",
  error: "text-[#E74C3C]",
  info: "text-[#0E6E7E]",
  warning: "text-[#F39C12]",
};

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={`${STYLES[toast.type]} rounded-xl shadow-lg p-4 flex items-start gap-3 pointer-events-auto animate-[fadeUp_0.25s_ease]`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${ICON_COLORS[toast.type]}`} />
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
              onClick={() => remove(toast.id)}
              className="shrink-0 p-0.5 rounded hover:bg-[#F7F9FA] transition-colors"
            >
              <X className="w-4 h-4 text-[#8FA5B5]" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
