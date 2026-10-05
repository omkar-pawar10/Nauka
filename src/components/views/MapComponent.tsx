"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { PORTS } from "@/lib/data";

// Fix Leaflet's default icon path issues in React
// @ts-expect-error patching leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Ports
const portIcon = new L.DivIcon({
  html: `<div style="width: 12px; height: 12px; background: black; border: 2px solid white; border-radius: 50%;"></div>`,
  className: "custom-port-icon",
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

// Custom Icon for Vessels
const createVesselIcon = (color: string) => new L.DivIcon({
  html: `<div style="width: 12px; height: 12px; background: ${color}; border: 2px solid black; transform: rotate(45deg);"></div>`,
  className: "custom-vessel-icon",
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

export default function MapComponent({ selectedVessel }: { selectedVessel: string | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-[#0a0a0a]" />;

  // Center on Indian Ocean / Middle East roughly
  const center: [number, number] = [15.0, 60.0];

  // Draw navigable routes with waypoints to avoid crossing land
  const routes: [number, number][][] = [
    // Singapore to Jebel Ali
    [
      [PORTS[0].lat, PORTS[0].lon],
      [5.9, 95.3], // Malacca Strait
      [5.8, 80.5], // South of Sri Lanka
      [24.0, 59.5], // Gulf of Oman
      [26.2, 56.4], // Strait of Hormuz
      [PORTS[3].lat, PORTS[3].lon]
    ],
    // Jebel Ali to Rotterdam
    [
      [PORTS[3].lat, PORTS[3].lon],
      [26.2, 56.4], // Strait of Hormuz
      [24.0, 59.5], // Gulf of Oman
      [12.5, 44.5], // Gulf of Aden
      [15.0, 41.5], // Red Sea
      [29.9, 32.5], // Suez Canal South
      [31.3, 32.3], // Suez Canal North
      [35.0, 20.0], // Mediterranean Sea
      [35.9, -5.5], // Strait of Gibraltar
      [39.0, -10.0], // Coast of Portugal
      [49.5, -4.5], // English Channel
      [PORTS[1].lat, PORTS[1].lon]
    ],
    // Singapore to Shanghai
    [
      [PORTS[0].lat, PORTS[0].lon],
      [15.0, 115.0], // South China Sea
      [24.5, 120.0], // Taiwan Strait
      [PORTS[2].lat, PORTS[2].lon]
    ]
  ];

  return (
    <MapContainer 
      center={center} 
      zoom={3} 
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles"
      />

      {/* Render Ports */}
      {PORTS.map(port => (
        <Marker key={port.id} position={[port.lat, port.lon]} icon={portIcon}>
          <Popup className="custom-popup">
            <strong className="text-black uppercase tracking-widest text-[10px]">{port.name}</strong>
          </Popup>
        </Marker>
      ))}

      {/* Render Routes */}
      {routes.map((route, i) => (
        <Polyline 
          key={i} 
          positions={route} 
          pathOptions={{ color: 'rgba(255, 255, 255, 0.2)', dashArray: '4, 4', weight: 2 }} 
        />
      ))}

      {/* Render a mock vessel position somewhere along the Singapore - Jebel Ali route */}
      <Marker 
        position={[5.85, 87.9]} 

        icon={createVesselIcon(selectedVessel === 'VSL-8921' ? '#d97706' : '#22c55e')}
      >
        <Popup className="custom-popup">
          <strong className="text-black uppercase tracking-widest text-[10px]">VSL-8921</strong>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
