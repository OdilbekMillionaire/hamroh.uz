"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 text-sm text-[#8FA5B5] ${className}`}>
      <Link href="/" className="flex items-center hover:text-[#0E6E7E] transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-[#D8E2E9]" />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="hover:text-[#0E6E7E] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#4A6274] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
