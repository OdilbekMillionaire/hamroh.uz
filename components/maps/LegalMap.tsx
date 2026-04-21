"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, Phone, Star, Building, Shield, Briefcase, Cross, MapPin, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

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
    lat: 55.7297,
    lng: 37.5700,
  },
  {
    id: "2",
    name: "Legal Aid Center — Migrants Rights",
    type: "lawyer",
    address: "Tverskaya St, 7, Moscow",
    phone: "+7 800 100-00-01",
    rating: 4.7,
    hours: "Mon-Sat 10:00-19:00",
    lat: 55.7627,
    lng: 37.6062,
  },
  {
    id: "3",
    name: "City Hospital No. 52",
    type: "hospital",
    address: "Pekhotnaya St, 3, Moscow",
    phone: "+7 499 190-52-52",
    rating: 4.0,
    hours: "24/7",
    lat: 55.7968,
    lng: 37.4498,
  },
  {
    id: "4",
    name: "Embassy of Uzbekistan in Seoul",
    type: "embassy",
    address: "Dong빙-dong, Yongsan-gu, Seoul",
    phone: "+82 2 574-6554",
    rating: 4.5,
    hours: "Mon-Fri 9:00-18:00",
    lat: 37.5400,
    lng: 126.9950,
  },
  {
    id: "5",
    name: "Korean Labor Rights Office",
    type: "lawyer",
    address: "Jung-gu, Seoul",
    phone: "+82 2 6902-5600",
    rating: 4.6,
    hours: "Mon-Fri 9:00-18:00",
    lat: 37.5636,
    lng: 126.9976,
  },
  {
    id: "6",
    name: "Embassy of Uzbekistan in Istanbul",
    type: "embassy",
    address: "Levent, Beşiktaş, Istanbul",
    phone: "+90 212 270-09-26",
    rating: 4.3,
    hours: "Mon-Fri 9:00-17:00",
    lat: 41.0794,
    lng: 29.0136,
  },
];

// Dynamically import Leaflet map to avoid SSR issues
const MapView = dynamic(() => import("./LeafletMapView"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-[#e8f4f6] flex items-center justify-center">
      <div className="text-center text-[var(--text-muted)]">
        <MapPin className="w-10 h-10 mx-auto mb-2 text-[var(--primary)] animate-pulse" />
        <p className="text-sm font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

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
      {/* Sidebar list */}
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
                    filter === f
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
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
                  selected === place.id && "bg-[var(--primary-light)] border-l-2 border-[var(--primary)]"
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
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5 text-xs text-[var(--text-muted)]">
                        <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                        {place.rating}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-[var(--text-muted)]">
                        <Clock className="w-3 h-3" />
                        {place.hours}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-[var(--text-muted)] text-sm">No results found.</div>
          )}
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative">
        <MapView
          places={filtered}
          selected={selected}
          onSelect={setSelected}
        />

        {/* Selected place card */}
        {selectedPlace && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-5 w-80 border border-[var(--border)] z-[1000]">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-[var(--text-primary)] text-sm leading-tight pr-2">{selectedPlace.name}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0 text-lg leading-none"
              >×</button>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-3">{selectedPlace.address}</p>
            <div className="space-y-1.5 text-xs mb-4">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Phone className="w-3.5 h-3.5 shrink-0" />{selectedPlace.phone}
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Clock className="w-3.5 h-3.5 shrink-0" />{selectedPlace.hours}
              </div>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Star className="w-3.5 h-3.5 text-yellow-400 shrink-0" fill="currentColor" />{selectedPlace.rating} / 5.0
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(selectedPlace.name + " " + selectedPlace.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3 h-3" /> Get Directions
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
