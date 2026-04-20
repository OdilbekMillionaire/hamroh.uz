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
  md: { icon: 34, text: "text-lg" },
  lg: { icon: 44, text: "text-2xl" },
  xl: { icon: 56, text: "text-3xl" },
};

/**
 * HamrohUz logomark.
 * Two pillars joined by a bridge + forward arrow = companionship + guidance.
 * Green star = Uzbek flag / destination reached.
 */
export function LogoIcon({
  size = 34,
  variant = "color",
}: {
  size?: number;
  variant?: "color" | "white" | "mono";
}) {
  const isDark = variant === "white";
  const bg = isDark ? "rgba(255,255,255,0.15)" : "#0E6E7E";
  const mark = "#ffffff";
  const accent = isDark ? "rgba(255,255,255,0.9)" : "#2ECC71";
  const gradId = `lg-${size}-${variant}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HamrohUz"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isDark ? "rgba(255,255,255,0.18)" : "#10808F"} />
          <stop offset="100%" stopColor={isDark ? "rgba(255,255,255,0.08)" : "#0A506A"} />
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect width="40" height="40" rx="11" fill={bg} />
      <rect width="40" height="40" rx="11" fill={`url(#${gradId})`} />

      {/* Left pillar */}
      <rect x="8" y="11" width="5" height="19" rx="2.5" fill={mark} />

      {/* Right pillar */}
      <rect x="27" y="11" width="5" height="19" rx="2.5" fill={mark} />

      {/* Crossbar */}
      <rect x="8" y="18.5" width="24" height="3" rx="1.5" fill={mark} opacity="0.8" />

      {/* Destination star — top-center */}
      <path
        d="M20 5 L21.1 8.1 L24.4 8.1 L21.8 10.1 L22.7 13.2 L20 11.3 L17.3 13.2 L18.2 10.1 L15.6 8.1 L18.9 8.1 Z"
        fill={accent}
      />
    </svg>
  );
}

export default function Logo({ href, size = "md", variant = "full", className }: LogoProps) {
  const { icon, text } = sizes[size];
  const isWhite = variant === "white";

  const content = (
    <span className={cn("flex items-center gap-2.5 select-none", className)}>
      <LogoIcon size={icon} variant={isWhite ? "white" : "color"} />
      {variant !== "icon" && (
        <span
          className={cn("font-extrabold leading-none tracking-tight", text)}
          style={{
            fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
            color: isWhite ? "#ffffff" : "#0E6E7E",
          }}
        >
          hamroh
          <span style={{ color: isWhite ? "rgba(255,255,255,0.55)" : "#2ECC71" }}>.uz</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }
  return <>{content}</>;
}
