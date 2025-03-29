'use client'; // Mark as a Client Component

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import L

// Configure Leaflet's default icon paths
// Do this OUTSIDE the component to ensure it runs only once
delete (L.Icon.Default.prototype as any)._getIconUrl; // Workaround for potential webpack issues

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png', // Path relative to public folder
  iconUrl: '/images/marker-icon.png',         // Path relative to public folder
  shadowUrl: '/images/marker-shadow.png',     // Path relative to public folder
});


interface MapDisplayProps {
  lat: number;
  lng: number;
  zoom?: number;
  popupText?: string;
  className?: string; // Allow passing custom Tailwind classes
}

export default function MapDisplay({ lat, lng, zoom = 13, popupText = "Location", className = "h-64 w-full" }: MapDisplayProps) {

  console.log("--- MapDisplay Component Render ---"); // Log when component renders
  console.log("Received Lat:", lat, "Lng:", lng);

  // Basic validation
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) { // Added NaN check
    console.error("Invalid lat/lng provided to MapDisplay:", lat, lng);
    return <div className={`${className} bg-gray-300 flex items-center justify-center text-red-500`}>Invalid Coordinates</div>;
  }

  const position: [number, number] = [lat, lng];

  return (
    <>
      {/* Remove the debugging style */}
      {/* <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          border: 2px solid red !important;
        }
      `}</style> */}
      <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} className={`${className} rounded z-0`}>
        <TileLayer
          attribution='&amp;copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Ensure URL is present
        />
        <Marker position={position}>
          <Popup>
            {popupText}
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
}
