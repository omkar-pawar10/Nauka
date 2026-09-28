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

  // Draw some great circle lines between ports for effect
  const routes = [
    [PORTS[0], PORTS[3]], // Singapore to Jebel Ali
    [PORTS[3], PORTS[1]], // Jebel Ali to Rotterdam
    [PORTS[0], PORTS[2]], // Singapore to Shanghai
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
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
          positions={[[route[0].lat, route[0].lon], [route[1].lat, route[1].lon]]} 
          pathOptions={{ color: 'rgba(255, 255, 255, 0.2)', dashArray: '4, 4', weight: 2 }} 
        />
      ))}

      {/* Render a mock vessel position somewhere along the Singapore - Jebel Ali route */}
      <Marker 
        position={[10.0, 80.0]} 
        icon={createVesselIcon(selectedVessel === 'VSL-8921' ? '#d97706' : '#22c55e')}
      >
        <Popup className="custom-popup">
          <strong className="text-black uppercase tracking-widest text-[10px]">VSL-8921</strong>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
