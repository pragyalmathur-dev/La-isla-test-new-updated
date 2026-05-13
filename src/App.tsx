import { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Marker, 
  Popup,
  ImageOverlay
} from 'react-leaflet';
import L from 'leaflet';
import { Home, Layers, Info, ChevronRight, Maximize2 } from 'lucide-react';

// South Goa - Exact Site Entry Point
const ENTRY_POINT: [number, number] = [14.950125, 74.053317];
const PROPERTY_CENTER: [number, number] = [14.9485, 74.0533];

// Bounds for the Site Plan Image Overlay
// These are approximate and should be tuned based on the exact image scaling
const SITE_PLAN_BOUNDS: [[number, number], [number, number]] = [
  [14.9440, 74.0515], // South West corner
  [14.9515, 74.0550], // North East corner
];

// Refined Property Boundary based on the long tapering site plan provided
const PROPERTY_BOUNDARY: [number, number][] = [
  [14.9505, 74.0530], // Top/North Entry
  [14.9515, 74.0535], 
  [14.9500, 74.0545],
  [14.9480, 74.0555], // Tapering out
  [14.9455, 74.0552], // Bottom East
  [14.9445, 74.0535], // Bottom most tip
  [14.9450, 74.0520], // Bottom West
  [14.9475, 74.0520],
  [14.9495, 74.0525],
];

const VILLAS = [
  // West Row (left side of road in plan)
  { id: 'v1', name: 'Villa 101', lat: 14.9498, lng: 74.0530, price: 'Rs. 4.2 Cr', status: 'Available' },
  { id: 'v2', name: 'Villa 102', lat: 14.9494, lng: 74.0532, price: 'Rs. 4.2 Cr', status: 'Available' },
  { id: 'v3', name: 'Villa 103', lat: 14.9490, lng: 74.0534, price: 'Rs. 4.5 Cr', status: 'Reserved' },
  { id: 'v4', name: 'Villa 104', lat: 14.9486, lng: 74.0536, price: 'Rs. 4.5 Cr', status: 'Available' },
  { id: 'v5', name: 'Villa 105', lat: 14.9482, lng: 74.0538, price: 'Rs. 4.8 Cr', status: 'Available' },
  { id: 'v6', name: 'Villa 106', lat: 14.9478, lng: 74.0540, price: 'Rs. 4.8 Cr', status: 'Reserved' },
  { id: 'v7', name: 'Villa 107', lat: 14.9474, lng: 74.0542, price: 'Rs. 5.2 Cr', status: 'Available' },
  
  // East Row (right side of road in plan)
  { id: 'v9', name: 'Villa 201', lat: 14.9500, lng: 74.0536, price: 'Rs. 4.1 Cr', status: 'Available' },
  { id: 'v10', name: 'Villa 202', lat: 14.9496, lng: 74.0538, price: 'Rs. 4.1 Cr', status: 'Available' },
  { id: 'v11', name: 'Villa 203', lat: 14.9492, lng: 74.0540, price: 'Rs. 4.3 Cr', status: 'Available' },
  { id: 'v12', name: 'Villa 204', lat: 14.9488, lng: 74.0542, price: 'Rs. 4.3 Cr', status: 'Reserved' },
  { id: 'v13', name: 'Villa 205', lat: 14.9484, lng: 74.0544, price: 'Rs. 4.6 Cr', status: 'Available' },
  { id: 'v14', name: 'Villa 206', lat: 14.9480, lng: 74.0546, price: 'Rs. 4.6 Cr', status: 'Available' },
  
  // Signature units at the bottom
  { id: 'v16', name: 'Elite Signature A', lat: 14.9465, lng: 74.0538, price: 'Rs. 7.5 Cr', status: 'Available' },
  { id: 'v17', name: 'Elite Signature B', lat: 14.9460, lng: 74.0534, price: 'Rs. 7.8 Cr', status: 'Available' },
  { id: 'pool', name: 'Infinity Pool & Spa', lat: 14.9455, lng: 74.0545, price: 'Amenity', status: 'Amenity' },
  { id: 'ch', name: 'The Clubhouse', lat: 14.9470, lng: 74.0530, price: 'Amenity', status: 'Amenity' },
];

// Helper to create custom markers using Leaflet's divIcon
const createCustomMarker = (status: string) => {
  let color = '#10b981'; // Green
  if (status === 'Reserved') color = '#ef4444'; // Red
  if (status === 'Amenity') color = '#3b82f6'; // Blue for Amenities
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

function Sidebar() {
  const projectFeatures = [
    "Private Beach Access",
    "Smart Home Integration",
    "Infinity Pool",
    "24/7 Concierge"
  ];

  return (
    <div className="absolute left-6 top-6 bottom-6 w-80 glass-panel rounded-2xl z-[1000] flex flex-col overflow-hidden pointer-events-auto">
      <div className="p-6 border-b border-zinc-100">
        <div className="flex items-center gap-2 text-orange-600 mb-1">
          <Home size={18} />
          <span className="text-[10px] uppercase font-bold tracking-widest">Premium Estate</span>
        </div>
        <h1 className="text-3xl font-serif italic text-zinc-900 leading-tight">Palms of South Goa</h1>
        <p className="text-sm text-zinc-500 mt-2 font-medium">Interactive Site Plan Showcase</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <div>
          <h2 className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-2 mb-4">
            <Info size={12} />
            Project Overview
          </h2>
          <p className="text-zinc-600 text-sm leading-relaxed italic">
            "A sanctuary of refined living, where the Arabian Sea meets the lush landscapes of South Goa."
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {projectFeatures.map((f, i) => (
              <div key={i} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md flex items-center gap-1">
                <div className="w-1 h-1 bg-orange-400 rounded-full" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-2 mb-4">
            <Layers size={12} />
            Available Units
          </h2>
          <div className="space-y-3">
            {VILLAS.map(v => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 hover:border-orange-200 transition-colors cursor-pointer group bg-zinc-50/50">
                <div>
                  <h4 className="text-sm font-medium text-zinc-800">{v.name}</h4>
                  <p className="text-[10px] text-zinc-500">{v.price}</p>
                </div>
                <ChevronRight size={14} className="text-zinc-300 group-hover:text-orange-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-900 text-white">
        <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 transition-colors rounded-xl font-medium text-sm flex items-center justify-center gap-2">
          Contact Sales Team
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="relative h-screen w-full bg-zinc-100 overflow-hidden">
      <Sidebar />
      
      <div className="absolute right-6 top-6 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <button className="glass-panel w-10 h-10 rounded-xl flex items-center justify-center text-zinc-700 hover:text-orange-600 transition-colors">
          <Maximize2 size={20} />
        </button>
        <button className="glass-panel w-10 h-10 rounded-xl flex items-center justify-center text-zinc-700 hover:text-orange-600 transition-colors">
          <Layers size={20} />
        </button>
      </div>

      <div className="h-full w-full">
        <MapContainer 
          center={PROPERTY_CENTER} 
          zoom={17} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {/* Using a free satellite-style tile layer from Esri via Leaflet */}
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          
          {/* Super-imposed site plan */}
          <ImageOverlay
            url="https://images.unsplash.com/photo-1541462608141-ad4d3f9505px?auto=format&fit=crop&q=80&w=2670" 
            // Using a high-quality placeholder for now. 
            // Replace with your project-specific "site-plan.png" file URL.
            bounds={SITE_PLAN_BOUNDS}
            opacity={0.7}
          />
          
          <Polygon 
            positions={PROPERTY_BOUNDARY} 
            pathOptions={{ 
              color: '#F27D26', 
              fillColor: 'transparent', 
              weight: 2,
              dashArray: '5, 10'
            }} 
          />

          <Marker 
            position={ENTRY_POINT}
            icon={L.divIcon({
              className: 'entry-point-icon',
              html: '<div style="background-color: #F27D26; width: 12px; height: 12px; border: 2px solid white; border-radius: 2px; transform: rotate(45deg);"></div>',
              iconSize: [12, 12],
              iconAnchor: [6, 6],
            })}
          >
            <Popup>Main Site Entry Point</Popup>
          </Marker>

          {VILLAS.map(villa => (
            <Marker 
              key={villa.id} 
              position={[villa.lat, villa.lng]}
              icon={createCustomMarker(villa.status)}
            >
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-bold text-zinc-900 border-b border-zinc-100 pb-1 mb-1">{villa.name}</h3>
                  <p className="text-sm text-zinc-600 font-medium">{villa.price}</p>
                  <span className={`text-[10px] inline-block mt-2 uppercase font-bold px-1.5 py-0.5 rounded-full ${
                    villa.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 
                    villa.status === 'Reserved' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {villa.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="absolute bottom-6 right-6 glass-panel px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-tighter text-zinc-500 z-[1000] pointer-events-none">
        South Goa Estate • Phase 01 Site Plan (OSM/Esri)
      </div>
    </div>
  );
}
