import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "white";
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: "text-base" },
  md: { icon: 34, text: "text-xl" },
  lg: { icon: 44, text: "text-2xl" },
  xl: { icon: 56, text: "text-3xl" },
};

export function LogoIcon({
  size = 34,
  variant = "color",
}: {
  size?: number;
  variant?: "color" | "white" | "mono";
}) {
  const primary = variant === "white" ? "#ffffff" : "#0E6E7E";
  const accent = variant === "white" ? "rgba(255,255,255,0.7)" : "#2ECC71";
  const bg = variant === "white" ? "rgba(255,255,255,0.15)" : "#E8F4F6";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HamrohUz logo"
    >
      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill={variant === "white" ? "rgba(255,255,255,0.2)" : primary} />

      {/* Shield body */}
      <path
        d="M20 7L10 11V20C10 25.5 14.5 30.5 20 32C25.5 30.5 30 25.5 30 20V11L20 7Z"
        fill={variant === "white" ? "rgba(255,255,255,0.9)" : "#ffffff"}
        opacity="0.15"
      />
      <path
        d="M20 8.5L11 12V20C11 25 15 29.5 20 31C25 29.5 29 25 29 20V12L20 8.5Z"
        stroke={variant === "white" ? "#ffffff" : "#ffffff"}
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />

      {/* H letter — bold, centered */}
      <path
        d="M15.5 14.5V25.5M24.5 14.5V25.5M15.5 20H24.5"
        stroke={variant === "white" ? "#ffffff" : "#ffffff"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Accent dot */}
      <circle cx="32" cy="8" r="4" fill={accent} />
    </svg>
  );
}

export default function Logo({ href, size = "md", variant = "full", className }: LogoProps) {
  const s = sizes[size];
  const isWhite = variant === "white";

  const inner = (
    <span className={cn("flex items-center gap-2.5 font-bold select-none", className)}>
      <LogoIcon size={s.icon} variant={isWhite ? "white" : "color"} />
      {variant !== "icon" && (
        <span
          className={cn(s.text, isWhite ? "text-white" : "text-[#0E6E7E]")}
          style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", letterSpacing: "-0.02em" }}
        >
          Hamroh
          <span className={isWhite ? "text-white/60" : "text-[#2ECC71]"}>Uz</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {inner}
      </Link>
    );
  }
  return inner;
}
