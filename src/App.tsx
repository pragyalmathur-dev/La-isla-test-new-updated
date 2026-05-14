import { useState, useRef, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup,
  ImageOverlay,
  Polyline,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Home, 
  Layers, 
  Maximize2, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  MapPin,
  Navigation,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// South Goa - Exact Site Entry Point
const ENTRY_POINT: [number, number] = [14.950125, 74.053317];
const PROPERTY_CENTER: [number, number] = [14.9485, 74.0533];

const NH66_PATH: [number, number][] = [
  [15.050960, 74.022532],
  [15.048075, 74.024836],
  [15.047873, 74.025682],
  [15.047792, 74.026346],
  [15.047520, 74.026423],
  [15.046730, 74.025494],
  [15.046003, 74.025593],
  [15.045190, 74.025391],
  [15.044726, 74.025841],
  [15.042171, 74.026158],
  [15.036641, 74.030524],
  [15.035473, 74.030332],
  [15.031756, 74.033324],
  [15.026775, 74.033262],
  [15.020331, 74.033406],
  [15.016787, 74.035036],
  [15.012821, 74.037148],
  [15.006891, 74.038025],
  [14.998919, 74.040851],
  [14.999300, 74.040818],
  [14.997130, 74.041197],
  [14.995434, 74.041387],
  [14.994248, 74.042436],
  [14.993460, 74.043818],
  [14.991909, 74.047785],
  [14.991181, 74.048590],
  [14.990344, 74.049161],
  [14.988018, 74.049324],
  [14.984476, 74.049432],
  [14.983475, 74.049084],
  [14.982716, 74.048272],
  [14.981217, 74.046049],
  [14.980799, 74.045478],
  [14.980041, 74.044753],
  [14.979198, 74.044278],
  [14.979055, 74.044277],
  [14.978316, 74.044323],
  [14.976034, 74.045275],
  [14.971480, 74.047073],
  [14.967998, 74.048422],
  [14.964538, 74.049770],
  [14.962011, 74.050822],
  [14.960394, 74.051536],
  [14.958993, 74.052814],
  [14.957011, 74.055316],
  [14.957332, 74.054904],
  [14.956745, 74.055615],
  [14.956420, 74.055996],
  [14.956013, 74.056480],
  [14.955945, 74.056580],
  [14.955730, 74.056806],
  [14.955531, 74.057035],
  [14.955363, 74.057204],
  [14.955115, 74.057284],
  [14.954898, 74.057297],
  [14.954368, 74.057247],
  [14.954115, 74.057120],
  [14.953637, 74.056440],
  [14.953210, 74.055530],
  [14.952898, 74.054928],
  [14.952571, 74.054678],
  [14.952291, 74.054635],
  [14.951996, 74.054666],
  [14.951681, 74.054775],
  [14.951437, 74.054899],
  [14.950878, 74.055345],
  [14.950129, 74.055971],
  [14.949078, 74.056832],
  [14.947464, 74.058170],
  [14.946692, 74.058774],
  [14.946282, 74.058969],
  [14.945855, 74.059145],
  [14.945386, 74.059274],
  [14.944530, 74.059431],
  [14.938599, 74.060378],
  [14.940930, 74.060019],
  [14.930026, 74.061705],
  [14.929269, 74.062505],
  [14.929540, 74.063538],
  [14.931545, 74.065868],
  [14.931653, 74.066491],
  [14.931526, 74.067317],
  [14.931010, 74.067672],
  [14.929081, 74.068105],
  [14.927965, 74.068669],
  [14.927486, 74.069118],
  [14.924226, 74.074348],
  [14.923353, 74.075266],
  [14.919579, 74.077336],
  [14.918254, 74.078087],
  [14.916584, 74.080430]
];

const GALGIBAGA_BEACH: [number, number] = [14.961497, 74.048541];
const TALPONA_BEACH: [number, number] = [14.976814, 74.042358];
const XANDREM_BEACH: [number, number] = [14.939333, 74.045792];
const TOLIVIA_BEACH: [number, number] = [14.934657, 74.047156];
const LALIT_RESORT: [number, number] = [14.991451, 74.042100];
const CRICKET_GROUND: [number, number] = [14.948755, 74.056363];
const HIGHER_SECONDARY: [number, number] = [14.948146, 74.056558];
const HAVANA_BAR: [number, number] = [14.962635, 74.052656];
const NIRAKAR_HIGH_SCHOOL: [number, number] = [14.960280, 74.055549];
const CHURCH_ST_ANTHONY: [number, number] = [14.964358, 74.048235];
const BLUEMOON_BY_NEELCHAND: [number, number] = [14.980423, 74.041433];
const CASA_JAALI: [number, number] = [14.999068, 74.028544];
const COTIGAO_WILDLIFE: [number, number] = [14.965751, 74.195798];
const MUDAGERI_FALLS: [number, number] = [14.904467, 74.132291];
const ZEST_CAFE: [number, number] = [14.998365, 74.033299];
const ACCESS_ROAD_PATH: [number, number][] = [
  [14.950220, 74.053487],
  [14.950326, 74.053734],
  [14.950404, 74.053942],
  [14.950486, 74.054136],
  [14.950596, 74.054340],
  [14.950712, 74.054538],
  [14.950819, 74.054747],
  [14.950895, 74.054915],
  [14.951028, 74.055109]
];

const STATE_BOUNDARY_PATH: [number, number][] = [
  [14.900215, 74.085037],
  [14.902114, 74.087173],
  [14.902897, 74.087784],
  [14.903445, 74.088193],
  [14.903439, 74.090275],
  [14.910986, 74.094491],
  [14.915798, 74.101614],
  [14.912912, 74.104792],
  [14.914191, 74.107340],
  [14.913965, 74.108513]
];

// Helper to create custom labels if needed in future
const entryLabel = L.divIcon({
  className: 'entry-point-icon',
  html: '<div style="background-color: #257057; width: 14px; height: 14px; border: 2px solid white; border-radius: 2px; transform: rotate(45deg); box-shadow: 0 0 10px rgba(37,112,87,0.7);"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const beachPin = L.divIcon({
  className: 'custom-div-icon',
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.7C12 21.7 20 15.4 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4 12 21.7 12 21.7Z" fill="#094f39" stroke="white" stroke-width="2"/>
    <circle cx="12" cy="10" r="3" fill="white"/>
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const restaurantPin = L.divIcon({
  className: 'custom-div-icon',
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#B9816B" stroke="white" stroke-width="2"/>
    <path d="M8 7V10C8 11.1046 8.89543 12 10 12V17M14 7V17M14 7C16 7 17 8.5 17 10C17 11.5 16 12 14 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 7V12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const schoolPin = L.divIcon({
  className: 'custom-div-icon',
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.7C12 21.7 20 15.4 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4 12 21.7 12 21.7Z" fill="#1A365D" stroke="white" stroke-width="2"/>
    <path d="M12 7L7 10L12 13L17 10L12 7Z" fill="white"/>
    <path d="M7 10V13.5C7 13.5 9 15 12 15C15 15 17 13.5 17 13.5V10" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

const cricketPin = L.divIcon({
  className: 'custom-div-icon',
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#4B7C47" stroke="white" stroke-width="2"/>
    <circle cx="12" cy="12" r="6" fill="white" fill-opacity="0.2" />
    <path d="M12 6V18M9 6C9 6 10.5 12 9 18M15 6C15 6 13.5 12 15 18" stroke="white" stroke-width="1" stroke-linecap="round" stroke-dasharray="0.5 1.5"/>
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const churchPin = L.divIcon({
  className: 'custom-div-icon',
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.7C12 21.7 20 15.4 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4 12 21.7 12 21.7Z" fill="#5856D6" stroke="white" stroke-width="2"/>
    <path d="M12 6V14M10 8H14" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});



// Custom component to handle image rotation since Leaflet doesn't support it natively
function RotatingImageOverlay({ url, bounds, opacity, rotation }: { 
  url: string, 
  bounds: L.LatLngBoundsExpression, 
  opacity: number, 
  rotation: number 
}) {
  const overlayRef = useRef<L.ImageOverlay>(null);

  useEffect(() => {
    if (overlayRef.current) {
      const img = overlayRef.current.getElement();
      if (img) {
        img.style.transform = `${img.style.transform.split('rotate')[0]} rotate(${rotation}deg)`;
      }
    }
  }, [rotation, bounds]);

  return (
    <ImageOverlay
      ref={overlayRef}
      url={url}
      bounds={bounds}
      opacity={opacity}
    />
  );
}

function MapRef({ onMap }: { onMap: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onMap(map);
  }, [map, onMap]);
  return null;
}

function ToSiteButton({ map, className }: { map: L.Map | null; className?: string }) {
  return (
    <button 
      onClick={() => map?.flyTo(PROPERTY_CENTER, 18)}
      className={`flex items-center justify-center gap-3 w-full py-4 bg-[#637d5b] hover:bg-[#52694b] text-white rounded-lg transition-all shadow-lg hover:shadow-xl group mb-6 ${className}`}
    >
      <div className="relative w-4 h-4">
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-white/80" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-white/80" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-white/80" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-white/80" />
      </div>
      <span className="text-[14px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">To Site</span>
    </button>
  );
}

function FloorPlanModal({ villaNumber, onClose }: { villaNumber: number; onClose: () => void }) {
  const [withDimension, setWithDimension] = useState(true);
  const [floor, setFloor] = useState<'gf' | 'ff'>('gf');

  const villaStr = villaNumber.toString().padStart(2, '0');
  const dimensionStr = withDimension ? 'wd' : 'wod';
  const fileName = `v${villaStr}_${dimensionStr}_${floor}.webp`;
  const filePath = `/floor-plans/${fileName}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#fdfdfb] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-zinc-100 shrink-0">
          <div>
            <h2 className="text-[24px] font-serif font-bold text-[#3d4a35] tracking-widest uppercase">Villa {villaStr}</h2>
            <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase mt-1">Floor Plan Perspective</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Controls - Mobile Top / Desktop Left */}
          <div className="p-6 md:p-8 md:w-64 shrink-0 bg-zinc-50/50 border-b md:border-b-0 md:border-r border-zinc-100 flex flex-col gap-8">
            {/* Dimension Toggle */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Dimensions</h3>
              <div className="flex p-1 bg-zinc-200/50 rounded-xl">
                <button 
                  onClick={() => setWithDimension(true)}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${withDimension ? 'bg-white text-[#3d4a35] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  With
                </button>
                <button 
                  onClick={() => setWithDimension(false)}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${!withDimension ? 'bg-white text-[#3d4a35] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                  Without
                </button>
              </div>
            </div>

            {/* Floor Toggle */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Floor Level</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setFloor('gf')}
                  className={`w-full py-3 px-4 text-[11px] font-bold rounded-xl border transition-all text-left flex justify-between items-center ${floor === 'gf' ? 'bg-[#3d4a35] border-[#3d4a35] text-white shadow-md' : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300'}`}
                >
                  Ground Floor
                  {floor === 'gf' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
                <button 
                  onClick={() => setFloor('ff')}
                  className={`w-full py-3 px-4 text-[11px] font-bold rounded-xl border transition-all text-left flex justify-between items-center ${floor === 'ff' ? 'bg-[#3d4a35] border-[#3d4a35] text-white shadow-md' : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300'}`}
                >
                  First Floor
                  {floor === 'ff' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
              </div>
            </div>

            <div className="mt-auto hidden md:block">
              <p className="text-[9px] text-zinc-400 leading-relaxed italic">
                Files are loaded from:<br/>
                <span className="font-mono text-[8px] break-all">{filePath}</span>
              </p>
            </div>
          </div>

          {/* Image Display */}
          <div className="flex-1 bg-[#f8f8f6] p-4 md:p-8 flex items-center justify-center overflow-auto">
            <div className="relative w-full max-w-3xl aspect-[4/3] bg-white rounded-xl shadow-inner border border-zinc-100 flex items-center justify-center overflow-hidden">
              <img 
                key={filePath}
                src={filePath} 
                alt={`Villa ${villaStr} ${floor === 'gf' ? 'Ground' : 'First'} Floor Plan`}
                className="max-w-full max-h-full object-contain p-4 transition-all duration-700 ease-in-out"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/800x600/fdfdfb/3d4a35?text=Floor+Plan+Not+Found\\n' + fileName;
                }}
              />
              
              {/* Overlay info */}
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-zinc-200/50 shadow-sm pointer-events-none">
                <p className="text-[9px] font-bold text-[#3d4a35] uppercase tracking-widest leading-none">
                  Plan: {dimensionStr.toUpperCase()} | {floor.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Sidebar({ 
  map, 
  isMobileExpanded, 
  setIsMobileExpanded,
  activeFilter,
  setActiveFilter,
  selectedVilla,
  setSelectedVilla
}: { 
  map: L.Map | null; 
  isMobileExpanded: boolean; 
  setIsMobileExpanded: (v: boolean) => void;
  activeFilter: string;
  setActiveFilter: (f: any) => void;
  selectedVilla: number | null;
  setSelectedVilla: (v: number | null) => void;
}) {
  const floorPlans = Array.from({ length: 48 }, (_, i) => i + 1);

  const filters = ['All', 'Restaurants', 'Education', 'Tourist Spots', 'Sports'];

  return (
    <div className={`absolute bottom-0 left-0 right-0 md:left-6 md:top-6 md:bottom-6 md:w-[360px] md:rounded-2xl z-[1000] flex flex-col overflow-hidden pointer-events-auto transition-all duration-500 ease-in-out ${isMobileExpanded ? 'h-[90vh]' : 'h-24 md:h-auto'} bg-[#fdfdfb] md:shadow-2xl border-none`}>
      {/* Brand Header */}
      <div className="p-6 pb-2 md:p-8 md:pb-4 shrink-0 bg-white border-b border-zinc-100">
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-[28px] font-serif font-bold text-[#3d4a35] tracking-widest uppercase">La Isla</h1>
          <button 
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="md:hidden text-zinc-400 p-1"
          >
            <div className="w-5 h-0.5 bg-zinc-400 mb-1" />
            <div className="w-5 h-0.5 bg-zinc-400" />
          </button>
        </div>
        <p className="text-[10px] md:text-[11px] font-medium tracking-[0.1em] text-zinc-400 uppercase">Architectural Planning & Floor Plans</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-10 scrollbar-hide">
        {/* To Site Section */}
        <div>
          <ToSiteButton map={map} />
          
          <div className="h-px bg-zinc-100 mb-8" />

            {/* Select Villa Section */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Select Villa</h3>
              <div className="grid grid-cols-5 gap-3">
                {floorPlans.map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedVilla(num)}
                    className={`aspect-square flex items-center justify-center text-[13px] font-bold rounded-lg border transition-all ${
                      selectedVilla === num
                        ? 'bg-[#637d5b] border-[#637d5b] text-white shadow-lg scale-110 z-10'
                        : 'bg-white border-zinc-200 text-zinc-300 hover:border-[#637d5b]/40 hover:text-[#637d5b]'
                    }`}
                  >
                    {num.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

          <div className="h-px bg-zinc-100 mt-8 mb-8" />

          {/* Render Section */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Render</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Aerial View", "2 BHK", "3 BHK", "4 BHK"].map((render) => (
                <button
                  key={render}
                  className="py-3 px-2 text-[12px] font-bold border border-zinc-200 rounded-lg hover:border-[#637d5b]/40 hover:text-[#637d5b] transition-all text-zinc-400 bg-white"
                >
                  {render}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-zinc-100 mt-8 mb-8" />

          {/* Filter Section */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Filter Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-[11px] font-bold rounded-full transition-all border ${
                    activeFilter === filter
                      ? 'bg-[#3d4a35] text-white border-[#3d4a35]'
                      : 'bg-white text-zinc-400 border-zinc-200 hover:border-[#3d4a35]/40 hover:text-[#3d4a35]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="p-6 bg-[#f2f1e6] shrink-0 text-center">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#637d5b]/60 uppercase">Project Visualization Layer</p>
      </div>
    </div>
  );
}

export default function App() {
  const [map, setMap] = useState<L.Map | null>(null);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Restaurants' | 'Education' | 'Tourist Spots' | 'Sports'>('All');
  const [selectedVilla, setSelectedVilla] = useState<number | null>(null);

  const [showOverlay] = useState(true);
  const [overlayOpacity] = useState(1);
  const [rotation] = useState(0);
  const [bounds] = useState<[[number, number], [number, number]]>([
    [14.947065895146313, 74.05147805773494],
    [14.950834104853687, 74.05402194226501]
  ]);

  return (
    <div className="relative h-screen w-full bg-[#f4f4f4] overflow-hidden">
      <Sidebar 
        map={map} 
        isMobileExpanded={isMobileExpanded} 
        setIsMobileExpanded={setIsMobileExpanded}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedVilla={selectedVilla}
        setSelectedVilla={setSelectedVilla}
      />
      
      <AnimatePresence>
        {selectedVilla !== null && (
          <FloorPlanModal 
            villaNumber={selectedVilla} 
            onClose={() => setSelectedVilla(null)} 
          />
        )}
      </AnimatePresence>
      
      <div className="absolute right-4 top-4 md:right-6 md:top-6 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <button className="glass-panel w-10 h-10 rounded-xl flex items-center justify-center text-zinc-700 hover:text-brand-primary transition-colors">
          <Maximize2 size={20} />
        </button>
      </div>

      <div className="h-full w-full">
        <MapContainer 
          center={PROPERTY_CENTER} 
          zoom={18} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; ESRI'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
          <MapRef onMap={setMap} />
          
          {showOverlay && (
            <RotatingImageOverlay
              url="/site-plan.png" 
              bounds={bounds}
              opacity={overlayOpacity}
              rotation={rotation}
            />
          )}

          {/* Galgibaga Beach Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Tourist Spots') && (
            <Marker position={GALGIBAGA_BEACH} icon={beachPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#094f39] text-[10px] font-bold tracking-wider uppercase">Galgibaga Beach</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">4 Min Drive</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">1.8 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* Talpona Beach Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Tourist Spots') && (
            <Marker position={TALPONA_BEACH} icon={beachPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#094f39] text-[10px] font-bold tracking-wider uppercase">Talpona Beach</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">8 Min Drive</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">4.2 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* Xandrem Beach Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Tourist Spots') && (
            <Marker position={XANDREM_BEACH} icon={beachPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#094f39] text-[10px] font-bold tracking-wider uppercase">Xandrem Beach</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">5 Min Drive</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">2.2 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* Tolivia Beach Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Tourist Spots') && (
            <Marker position={TOLIVIA_BEACH} icon={beachPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#094f39] text-[10px] font-bold tracking-wider uppercase">Tolivia Beach</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">7 Min Drive</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">3.1 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* The Lalit Golf & Spa Resort Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Tourist Spots') && (
            <Marker position={LALIT_RESORT} icon={beachPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#094f39] text-[10px] font-bold tracking-wider uppercase">The Lalit Golf & Spa Resort</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">12 Min Drive</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">7.5 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* Havana Bar & Restaurant */}
          {(activeFilter === 'All' || activeFilter === 'Restaurants') && (
            <Marker position={HAVANA_BAR} icon={restaurantPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#B9816B] text-[10px] font-bold tracking-wider uppercase">Havana Bar & Restaurant</span>
                  <span className="text-[#B9816B]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">5 Min Drive</span>
                  <span className="text-[#B9816B]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">2.1 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* Bluemoon by Neelchand Restaurant */}
          {(activeFilter === 'All' || activeFilter === 'Restaurants') && (
            <Marker position={BLUEMOON_BY_NEELCHAND} icon={restaurantPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#B9816B] text-[10px] font-bold tracking-wider uppercase">Bluemoon by Neelchand</span>
                  <span className="text-[#B9816B]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">6 Min Drive</span>
                  <span className="text-[#B9816B]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">2.4 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* Nirakar Cricket Ground Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Sports') && (
            <Marker position={CRICKET_GROUND} icon={cricketPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#4B7C47] text-[10px] font-bold tracking-wider uppercase">Nirakar Cricket Ground</span>
                  <span className="text-[#4B7C47]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">1 Min Drive</span>
                  <span className="text-[#4B7C47]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">0.4 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* S S Angle Higher Secondary School Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Education') && (
            <Marker position={HIGHER_SECONDARY} icon={schoolPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#1A365D] text-[10px] font-bold tracking-wider uppercase">S S Angle Higher Secondary School</span>
                  <span className="text-[#1A365D]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">1 Min Drive</span>
                  <span className="text-[#1A365D]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">0.3 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}
          
          {/* Nirakar High School Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Education') && (
            <Marker position={NIRAKAR_HIGH_SCHOOL} icon={schoolPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#1A365D] text-[10px] font-bold tracking-wider uppercase">Nirakar High School</span>
                  <span className="text-[#1A365D]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">3 Min Drive</span>
                  <span className="text-[#1A365D]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">1.5 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}
          
          {/* Church of St Anthony of Lisbon Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Tourist Spots') && (
            <Marker position={CHURCH_ST_ANTHONY} icon={churchPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#5856D6] text-[10px] font-bold tracking-wider uppercase">Church of St Anthony of Lisbon</span>
                  <span className="text-[#5856D6]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">5 Min Drive</span>
                  <span className="text-[#5856D6]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">2.8 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}
          
          {/* Casa Jaali (Cafe) Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Restaurants') && (
            <Marker position={CASA_JAALI} icon={restaurantPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#B9816B] text-[10px] font-bold tracking-wider uppercase">Casa Jaali (Cafe)</span>
                  <span className="text-[#B9816B]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">15 Min Drive</span>
                  <span className="text-[#B9816B]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">9.5 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}


          {/* Cotigao Wildlife Sanctuary Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Tourist Spots') && (
            <Marker position={COTIGAO_WILDLIFE} icon={beachPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#094f39] text-[10px] font-bold tracking-wider uppercase">Cotigao Wildlife Sanctuary</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">35 Min Drive</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">22 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* Mudageri Falls Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Tourist Spots') && (
            <Marker position={MUDAGERI_FALLS} icon={beachPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#094f39] text-[10px] font-bold tracking-wider uppercase">Mudageri Falls</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">25 Min Drive</span>
                  <span className="text-[#094f39]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">14 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}

          {/* Zest (Cafe & Bar) Pinpoint */}
          {(activeFilter === 'All' || activeFilter === 'Restaurants') && (
            <Marker position={ZEST_CAFE} icon={restaurantPin}>
              <Tooltip direction="top" className="beach-tooltip">
                <span>
                  <span className="text-[#B9816B] text-[10px] font-bold tracking-wider uppercase">Zest (Cafe & Bar)</span>
                  <span className="text-[#B9816B]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">14 Min Drive</span>
                  <span className="text-[#B9816B]/80 text-[8px] font-medium uppercase tracking-widest leading-tight">7.2 KM Away</span>
                </span>
              </Tooltip>
            </Marker>
          )}


          {/* NH 66 Highway */}
          <Polyline 
            positions={NH66_PATH} 
            pathOptions={{ 
              color: '#f4f6fc', 
              weight: 4, 
              opacity: 0.8,
              dashArray: '1, 0' // Solid line
            }}
          />

          {/* NH 66 Label at specific coordinates */}
          <Marker 
            position={[14.951625, 74.054830]} 
            icon={L.divIcon({ className: 'pointer-events-none' })}
          >
            <Tooltip permanent direction="top" className="highway-tooltip" offset={[0, 0]}>
              <span className="bg-[#094f39] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-lg border border-white/20">NH66</span>
            </Tooltip>
          </Marker>

          <Marker 
            position={[14.993460, 74.043818]} 
            icon={L.divIcon({ className: 'pointer-events-none' })}
          >
            <Tooltip permanent direction="top" className="highway-tooltip" offset={[0, 0]}>
              <span className="bg-[#094f39] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-lg border border-white/20">NH66</span>
            </Tooltip>
          </Marker>

          <Marker 
            position={[14.973003, 74.046446]} 
            icon={L.divIcon({ className: 'pointer-events-none' })}
          >
            <Tooltip permanent direction="top" className="highway-tooltip" offset={[0, 0]}>
              <span className="bg-[#094f39] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-lg border border-white/20">NH66</span>
            </Tooltip>
          </Marker>

          <Marker 
            position={[14.922651, 74.075744]} 
            icon={L.divIcon({ className: 'pointer-events-none' })}
          >
            <Tooltip permanent direction="top" className="highway-tooltip" offset={[0, 0]}>
              <span className="bg-[#094f39] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-lg border border-white/20">NH66</span>
            </Tooltip>
          </Marker>

          {/* Dotted Access Road */}
          <Polyline 
            positions={ACCESS_ROAD_PATH} 
            pathOptions={{ 
              color: '#f4f6fc', 
              weight: 3, 
              opacity: 0.8,
              dashArray: '5, 8' // Dotted effect
            }}
          />

          {/* Access Road Label */}
          <Marker 
            position={[14.950596, 74.054340]} 
            icon={L.divIcon({ className: 'pointer-events-none' })}
          >
            <Tooltip permanent direction="top" className="highway-tooltip" offset={[0, 0]}>
              <span className="bg-[#094f39] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-lg border border-white/20">Access Road</span>
            </Tooltip>
          </Marker>

          {/* State Boundary (Goa-Karnataka) */}
          <Polyline 
            positions={STATE_BOUNDARY_PATH} 
            pathOptions={{ 
              color: '#ffffff', 
              weight: 4, 
              opacity: 0.6,
              dashArray: '4, 8' // Broad dotted
            }}
          />

          {/* State Labels along the boundary */}
          <Marker 
            position={[14.910986, 74.094491]} 
            icon={L.divIcon({ className: 'pointer-events-none' })}
          >
            <Tooltip permanent direction="top" className="boundary-label-goa" offset={[0, -10]}>
              <span className="text-white text-[8px] font-bold tracking-[0.3em] uppercase">Goa</span>
            </Tooltip>
            <Tooltip permanent direction="bottom" className="boundary-label-karnataka" offset={[0, 10]}>
              <span className="text-white text-[8px] font-bold tracking-[0.3em] uppercase">Karnataka</span>
            </Tooltip>
          </Marker>
        </MapContainer>
      </div>

      <div className="absolute bottom-6 right-4 md:right-6 bg-[#3d4a35]/80 backdrop-blur-sm px-4 py-2 rounded-xl text-[9px] font-medium tracking-wide text-white z-[1000] pointer-events-none max-w-[160px] md:max-w-[200px] text-right border border-white/10 shadow-2xl">
        To view the location names, hover over them with your cursor. On mobile, simply tap the location.
      </div>
    </div>
  );
}
