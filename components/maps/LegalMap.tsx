"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, MapPin, Phone, Star, Building, Shield, Briefcase, Cross } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "police", "hospital", "lawyer", "embassy"] as const;

const FILTER_ICONS = {
  all: MapPin,
  police: Shield,
  hospital: Cross,
  lawyer: Briefcase,
  embassy: Building,
};

const mockPlaces = [
  {
    id: "1",
    name: "Embassy of Uzbekistan in Moscow",
    type: "embassy",
    address: "Pogodinskaya St, 12, Moscow",
    phone: "+7 495 143-31-15",
    rating: 4.2,
    hours: "Mon-Fri 9:00-17:00",
  },
  {
    id: "2",
    name: "Legal Aid Center — Migrants Rights",
    type: "lawyer",
    address: "Tverskaya St, 7, Moscow",
    phone: "+7 800 100-00-01",
    rating: 4.7,
    hours: "Mon-Sat 10:00-19:00",
  },
  {
    id: "3",
    name: "City Hospital No. 52",
    type: "hospital",
    address: "Pekhotnaya St, 3, Moscow",
    phone: "+7 499 190-52-52",
    rating: 4.0,
    hours: "24/7",
  },
];

export default function LegalMap() {
  const t = useTranslations("maps.legal");
  const [filter, setFilter] = useState<typeof FILTERS[number]>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = mockPlaces.filter((p) => {
    if (filter !== "all" && p.type !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedPlace = mockPlaces.find((p) => p.id === selected);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 shrink-0 border-r border-[var(--border)] flex flex-col bg-white">
        <div className="p-4 border-b border-[var(--border)]">
          <h1 className="font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: "var(--font-jakarta)" }}>
            {t("title")}
          </h1>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-9 pr-3 py-2 border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {FILTERS.map((f) => {
              const Icon = FILTER_ICONS[f];
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                    filter === f ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {t(`filters.${f}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
          {filtered.map((place) => {
            const Icon = FILTER_ICONS[place.type as keyof typeof FILTER_ICONS] || MapPin;
            return (
              <button
                key={place.id}
                onClick={() => setSelected(place.id === selected ? null : place.id)}
                className={cn(
                  "w-full p-4 text-left hover:bg-[var(--bg-subtle)] transition-colors",
                  selected === place.id && "bg-[var(--primary-light)]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    selected === place.id ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-secondary)]"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-tight">{place.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{place.address}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <span className="text-xs text-[var(--text-muted)]">{place.rating}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 relative bg-[var(--bg-muted)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-[var(--text-muted)]">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-[var(--primary)]" />
            <p className="font-medium text-[var(--text-secondary)]">Interactive Map</p>
            <p className="text-sm mt-1">Google Maps API key required</p>
            <p className="text-xs mt-1 text-[var(--text-muted)]">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local</p>
          </div>
        </div>

        {selectedPlace && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg p-5 w-80 border border-[var(--border)]">
            <h3 className="font-bold text-[var(--text-primary)] mb-1 text-sm">{selectedPlace.name}</h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">{selectedPlace.address}</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Phone className="w-3.5 h-3.5" />
                {selectedPlace.phone}
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Star className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
                {selectedPlace.rating} / 5.0
              </div>
            </div>
            <button className="mt-3 w-full btn-primary text-xs py-2">Get Directions</button>
          </div>
        )}
      </div>
    </div>
  );
}
