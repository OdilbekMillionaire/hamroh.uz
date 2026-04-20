"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 left-6 z-[100] w-10 h-10 bg-[#0E6E7E] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0B5A6A] transition-all hover:scale-110 active:scale-95"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
