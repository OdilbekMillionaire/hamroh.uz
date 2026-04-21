"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons that webpack breaks
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const selectedIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Place {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  rating: number;
  hours: string;
  lat: number;
  lng: number;
}

function FlyToSelected({ places, selected }: { places: Place[]; selected: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selected) return;
    const place = places.find((p) => p.id === selected);
    if (place) {
      map.flyTo([place.lat, place.lng], 14, { duration: 0.8 });
    }
  }, [selected, places, map]);
  return null;
}

interface Props {
  places: Place[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function LeafletMapView({ places, selected, onSelect }: Props) {
  return (
    <MapContainer
      center={[48.0, 35.0]}
      zoom={3}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected places={places} selected={selected} />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={selected === place.id ? selectedIcon : new L.Icon.Default()}
          eventHandlers={{ click: () => onSelect(place.id === selected ? null : place.id) }}
        >
          <Popup>
            <div className="text-xs">
              <p className="font-bold text-sm mb-0.5">{place.name}</p>
              <p className="text-gray-500">{place.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
