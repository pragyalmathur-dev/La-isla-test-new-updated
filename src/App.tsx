import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  X,
  Mail,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Map as MapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { villaService, enquiryService } from './lib/firestoreService';
import { collection, doc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore';

// Types
interface Villa {
  id: string;
  number: number;
  type: string;
  status: 'Available' | 'Sold' | 'Reserved';
  price?: number;
  sqft?: number;
  description?: string;
  image?: string;
}

// South Goa - Exact Site Entry Point
const ENTRY_POINT: [number, number] = [14.950125, 74.053317];
const PROPERTY_CENTER: [number, number] = [14.9485, 74.0533];

const ALLOWED_EMAILS = [
  'akansha.trehan@vianaar.com',
  'ruchi.sharma@vianaar.com',
  'pragyal.mathur@vianaar.com',
  'lance.godinho@vianaar.com',
  'nikhil.mishra@vianaar.com',
  'shivani.bharti@vianaar.com',
  'mohan.choudhary@vianaar.com',
  'suraj.pinge@vianaar.com',
  'agnit.nandy@vianaar.com',
  'divya.arora@vianaar.com',
  'armando.braganca@vianaar.com',
  'sidharth.najeev@vianaar.com',
  'rohit.anurag@vianaar.com',
  'himanshu.singh@vianaar.com',
  'abhishek.katoch@vianaar.com',
  'lawrence.rodrigues@vianaar.com',
  'aman.shaikh@vianaar.com',
  'ashish.khazanchi@vianaar.com',
  'pragati.srivastava@vianaar.com',
  'ritika.sharma@vianaar.com',
  'shomnath.mazumdar@vianaar.com',
  'abhin.bajaj@vianaar.com',
  'akshada.sawant@vianaar.com',
  'nirav.sidhpura@vianaar.com',
  'salony.porwal@vianaar.com',
  'rudrankk.banerjii@vianaar.com',
  'bibek.sen@vianaar.com',
  'varun.nagpal@vianaar.com',
  'naina.nagpal@vianaar.com',
  'pragyalmathur@gmail.com',
  'vianaar.platform@gmail.com',
  'admin@vianaar.com'
];

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

function FloorPlanModal({ villa, onClose }: { villa: Villa; onClose: () => void }) {
  const [withDimension, setWithDimension] = useState(true);
  const [floor, setFloor] = useState<'gf' | 'ff'>('gf');
  const [showEnquiry, setShowEnquiry] = useState(false);

  const villaNumber = villa.number;
  const villaStr = villaNumber.toString().padStart(2, '0');
  const dimensionStr = withDimension ? 'wd' : 'wod';
  const fileName = `v${villaStr}_${dimensionStr}_${floor}.webp`;
  const filePath = `/floor-plans/${fileName}`;

  // If showing enquiry form
  if (showEnquiry) {
    return (
      <EnquiryModal 
        villa={villa} 
        onClose={() => setShowEnquiry(false)} 
        onSuccess={() => {
            setShowEnquiry(false);
            onClose();
        }}
      />
    );
  }

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
        className="bg-[#fdfdfb] w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-zinc-100 shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-[24px] font-serif font-bold text-[#3d4a35] tracking-widest uppercase">Villa {villaStr}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Floor Plan Perspective</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                  villa.status === 'Available' ? 'text-emerald-600' : 
                  villa.status === 'Sold' ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {villa.status}
                </span>
              </div>
            </div>
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
          {/* Details & Controls - Mobile Top / Desktop Left */}
          <div className="p-6 md:p-8 md:w-80 shrink-0 bg-zinc-50/50 border-b md:border-b-0 md:border-r border-zinc-100 flex flex-col gap-6 overflow-y-auto">
            
            <div className="h-px bg-zinc-200/50" />

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

            <div className="mt-auto pt-6">
              <button 
                onClick={() => setShowEnquiry(true)}
                disabled={villa.status !== 'Available'}
                className="w-full py-4 bg-[#637d5b] hover:bg-[#52694b] disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md hover:shadow-lg font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                {villa.status === 'Available' ? 'Enquire Now' : 'Not Available'}
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="flex-1 bg-[#f8f8f6] p-4 md:p-12 flex items-center justify-center overflow-auto">
            <div className="relative w-full max-w-4xl aspect-[4/3] bg-white rounded-xl shadow-inner border border-zinc-100 flex items-center justify-center overflow-hidden">
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
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-200/50 shadow-lg pointer-events-none">
                <p className="text-[10px] font-bold text-[#3d4a35] uppercase tracking-[0.2em] leading-none">
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

function EnquiryModal({ villa, onClose, onSuccess }: { villa: Villa; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await enquiryService.createEnquiry({
        villaId: villa.id,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        message: formData.message
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError('Failed to send enquiry. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#3d4a35]">Enquiry Sent!</h2>
            <p className="text-zinc-500 text-[13px]">We have received your enquiry for Villa {villa.number.toString().padStart(2, '0')}. Our team will contact you shortly.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#3d4a35] tracking-tight">Enquire Now</h2>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Villa {villa.number.toString().padStart(2, '0')}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3.5 pl-12 pr-4 text-[13px] focus:bg-white focus:ring-2 focus:ring-[#637d5b]/20 focus:border-[#637d5b] transition-all"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3.5 pl-12 pr-4 text-[13px] focus:bg-white focus:ring-2 focus:ring-[#637d5b]/20 focus:border-[#637d5b] transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3.5 pl-12 pr-4 text-[13px] focus:bg-white focus:ring-2 focus:ring-[#637d5b]/20 focus:border-[#637d5b] transition-all"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-3.5 px-4 text-[13px] h-28 resize-none focus:bg-white focus:ring-2 focus:ring-[#637d5b]/20 focus:border-[#637d5b] transition-all"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-500 text-[11px] flex items-center gap-2 rounded-lg">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#3d4a35] hover:bg-[#2d3627] text-white rounded-xl transition-all shadow-lg font-bold text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Submit Enquiry'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function LoginPage({ onAuthorize }: { onAuthorize: (email: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAccessDenied(false);
    setError(null);

    // Artificial delay for feedback
    setTimeout(() => {
      const email = emailInput.trim().toLowerCase();
      
      if (ALLOWED_EMAILS.includes(email)) {
        onAuthorize(email);
      } else {
        setAccessDenied(true);
      }
      setLoading(false);
    }, 800);
  };

  const handleTryAgain = () => {
    setAccessDenied(false);
    setEmailInput('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#f3f4f1] p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-12 flex flex-col items-center"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#e9f2ee] rounded-full flex items-center justify-center mb-8 md:mb-10">
          <MapIcon className="text-[#094f39]" size={36} />
        </div>

        <h2 className="text-[#094f39] text-[20px] md:text-[24px] font-bold tracking-[0.1em] uppercase mb-6 md:mb-8 text-center">{accessDenied ? 'Access Denied' : 'Confidential Map'}</h2>

        {accessDenied ? (
          <div className="bg-red-50 rounded-[24px] p-6 md:p-8 mb-8 md:mb-10 text-center text-red-600 text-[13px] md:text-[14px] leading-relaxed border border-red-100 w-full">
            <AlertCircle className="mx-auto mb-3" size={24} />
            Your email does not have permission to access this resource. Please contact the administrator.
          </div>
        ) : error ? (
          <div className="bg-amber-50 rounded-[24px] p-6 md:p-8 mb-8 md:mb-10 text-center text-amber-700 text-[13px] md:text-[14px] leading-relaxed border border-amber-100 w-full">
            <AlertCircle className="mx-auto mb-3" size={24} />
            {error}
          </div>
        ) : (
          <div className="bg-[#f8f9f8] rounded-[24px] p-6 md:p-8 mb-8 md:mb-10 text-center text-[#556d64] text-[14px] md:text-[15px] leading-relaxed w-full">
            This is a confidential architectural resource. Please enter your email to proceed.
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6 md:space-y-8">
          {!accessDenied && !error && (
            <div className="relative">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Email Address"
                className="w-full px-5 py-4 md:px-6 md:py-5 rounded-xl border border-zinc-200 bg-white text-[#3d4a35] placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#094f39]/10 focus:border-[#094f39] transition-all text-[14px] md:text-[16px]"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          )}

          <button
            type={accessDenied || error ? 'button' : 'submit'}
            onClick={accessDenied || error ? handleTryAgain : undefined}
            disabled={loading}
            className="w-full py-4 md:py-5 bg-[#094f39] hover:bg-[#073d2c] text-white rounded-2xl font-bold text-[14px] md:text-[16px] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : (accessDenied || error) ? 'Try with different email' : 'Get Access'}
          </button>
        </form>

        <div className="mt-12 w-full text-center">
          <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em] opacity-80">Vianaar Internal Security</p>
        </div>
      </motion.div>
    </div>
  );
}

function RenderModal({ category, onClose }: { category: string; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Data mapping for renders based on user's naming convention
  const renderData: Record<string, { title: string, stems: string[] }> = {
    "Aerial View": { 
      title: "Aerial View", 
      stems: ["aerial_view"] 
    },
    "2 BHK": { 
      title: "2 BHK Perspective", 
      stems: ["2bhk_balcony", "2bhk_exterior", "2bhk_facade"] 
    },
    "3 BHK": { 
      title: "3 BHK Perspective", 
      stems: ["3bhk_ext_1", "3bhk_ext_2", "3bhk_terrace"] 
    },
    "4 BHK": { 
      title: "4 BHK Perspective", 
      stems: ["4bhk_balcony", "4bhk_exterior", "4bhk_facade", "4bhk_terrace"] 
    }
  };

  const currentCategory = renderData[category] || { title: category, stems: [category.toLowerCase().replace(' ', '_')] };
  const images = currentCategory.stems;
  const currentImageStem = images[currentIndex];
  const fileName = `${currentImageStem}.jpg`;
  const filePath = `/renders/${fileName}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3000] flex flex-col bg-[#fdfdfb]"
      onClick={onClose}
    >
      {/* Modal Header */}
      <div className="p-6 md:p-8 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-[28px] font-serif font-bold text-[#3d4a35] tracking-widest uppercase">{category}</h2>
          <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase mt-1">
            Perspective {currentIndex + 1} of {images.length}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
        >
          <X size={32} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full h-full max-w-7xl flex items-center justify-center group">
          <AnimatePresence mode="wait">
            <motion.img
              key={filePath}
              src={filePath}
              alt={`${category} perspective ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/1200x800/fdfdfb/3d4a35?text=${category}+Render\\n${fileName}`;
              }}
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="absolute left-4 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white md:opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-4 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white md:opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails / Footer */}
      {images.length > 1 && (
        <div className="p-8 flex justify-center gap-4 shrink-0 bg-zinc-50/50" onClick={(e) => e.stopPropagation()}>
          {images.map((stem, idx) => (
            <button
              key={stem}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-[#637d5b] scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img 
                src={`/renders/${stem}.jpg`}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/120x80/fdfdfb/3d4a35?text=${idx + 1}`;
                }}
              />
              {idx === currentIndex && (
                <div className="absolute inset-0 bg-[#637d5b]/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Sidebar({ 
  map, 
  user,
  villas,
  isMobileExpanded, 
  setIsMobileExpanded,
  activeFilter,
  setActiveFilter,
  selectedVillaId,
  setSelectedVillaId,
  setSelectedRenderCategory
}: { 
  map: L.Map | null; 
  user: any;
  villas: Villa[];
  isMobileExpanded: boolean; 
  setIsMobileExpanded: (v: boolean) => void;
  activeFilter: string;
  setActiveFilter: (f: any) => void;
  selectedVillaId: string | null;
  setSelectedVillaId: (v: string | null) => void;
  setSelectedRenderCategory: (c: string | null) => void;
}) {
  const filters = ['All', 'Restaurants', 'Education', 'Tourist Spots', 'Sports'];
  const authorizedEmail = localStorage.getItem('la-isla-user-email');

  return (
    <div className={`absolute bottom-0 left-0 right-0 md:left-6 md:top-6 md:bottom-6 md:w-[360px] md:rounded-2xl z-[1000] flex flex-col overflow-hidden pointer-events-auto transition-all duration-500 ease-in-out ${isMobileExpanded ? 'h-[90vh]' : 'h-20 md:h-auto'} bg-[#fdfdfb] md:shadow-2xl border-none`}>
      {/* Brand Header */}
      <div 
        className="p-5 md:p-8 shrink-0 bg-white border-b border-zinc-100 cursor-pointer md:cursor-default"
        onClick={() => { if (window.innerWidth < 768) setIsMobileExpanded(!isMobileExpanded); }}
      >
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-[24px] md:text-[28px] font-serif font-bold text-[#3d4a35] tracking-widest uppercase leading-none">La Isla</h1>
          <div className="flex items-center gap-3">
             {authorizedEmail && (
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-[#637d5b]/10 border border-[#637d5b]/20 flex items-center justify-center">
                   <User size={14} className="text-[#637d5b]" />
                 </div>
                 <span className="hidden md:block text-[9px] font-bold text-zinc-400 uppercase tracking-tighter max-w-[100px] truncate">{authorizedEmail.split('@')[0]}</span>
               </div>
             )}
            <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileExpanded(!isMobileExpanded);
                }}
                className="md:hidden text-[#637d5b] p-2 bg-[#637d5b]/10 rounded-full transition-all border border-[#637d5b]/20"
                aria-label={isMobileExpanded ? "Collapse navigation" : "Expand navigation"}
            >
                {isMobileExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} className="animate-bounce" />}
            </button>
          </div>
        </div>
        <p className="text-[9px] md:text-[11px] font-medium tracking-[0.1em] text-zinc-400 uppercase">Architectural Planning & Floor Plans</p>
      </div>

      <div className={`flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-10 scrollbar-hide ${!isMobileExpanded ? 'hidden md:block' : ''}`}>
        {/* To Site Section */}
        <div>
          <ToSiteButton map={map} />
          
          <div className="h-px bg-zinc-100 mb-8" />

            {/* Select Villa Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase">Select Villa</h3>
                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">{villas.length} Inventories</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {villas.map((villa) => (
                  <button
                    key={villa.id}
                    onClick={() => setSelectedVillaId(villa.id)}
                    className={`aspect-square relative flex items-center justify-center text-[13px] font-bold rounded-lg border transition-all ${
                      selectedVillaId === villa.id
                        ? 'bg-[#637d5b] border-[#637d5b] text-white shadow-lg scale-110 z-10'
                        : 'bg-white border-zinc-200 text-zinc-400 hover:border-[#637d5b]/40 hover:text-[#637d5b]'
                    }`}
                  >
                    {villa.number.toString().padStart(2, '0')}
                    {villa.status === 'Sold' && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 border border-white rounded-full" />
                    )}
                    {villa.status === 'Reserved' && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border border-white rounded-full" />
                    )}
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
                  onClick={() => setSelectedRenderCategory(render)}
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(localStorage.getItem('la-isla-authorized') === 'true');
  const [villas, setVillas] = useState<Villa[]>([]);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Restaurants' | 'Education' | 'Tourist Spots' | 'Sports'>('All');
  const [selectedVillaId, setSelectedVillaId] = useState<string | null>(null);
  const [selectedRenderCategory, setSelectedRenderCategory] = useState<string | null>(null);

  const [showOverlay] = useState(true);
  const [overlayOpacity] = useState(1);
  const [rotation] = useState(0);
  const [bounds] = useState<[[number, number], [number, number]]>([
    [14.947065895146313, 74.05147805773494],
    [14.950834104853687, 74.05402194226501]
  ]);

  useEffect(() => {
    // Subscribe to villas immediately as they are public in rules
    const unsubVillas = villaService.subscribeToVillas((data) => {
        // If the inventory is missing or incomplete, trigger seeding
        // Expecting 47 villas (1-48, skipping 13)
        if (data.length < 47) {
            seedInitialVillas();
        }

        // Sync status for Sold villas
        const soldVillas = [5, 6, 8, 9, 11, 18, 22, 23, 24, 27, 28, 30];
        const reservedVillas = [10, 16, 42, 46, 47, 48];

        data.forEach(v => {
          const villa = v as Villa;
          let targetStatus: 'Available' | 'Sold' | 'Reserved' = 'Available';
          if (soldVillas.includes(villa.number)) targetStatus = 'Sold';
          else if (reservedVillas.includes(villa.number)) targetStatus = 'Reserved';
          
          if (villa.status !== targetStatus) {
            villaService.updateVilla(villa.id, { status: targetStatus });
          }
        });

        setVillas(data as Villa[]);
    });

    // Also keep Firebase Auth for background session integrity, 
    // but the main UI state is driven by isAuthorized
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => {
        unsubscribe();
        unsubVillas();
    };
  }, []);

  const handleAuthorize = (email: string) => {
    localStorage.setItem('la-isla-authorized', 'true');
    localStorage.setItem('la-isla-user-email', email);
    setIsAuthorized(true);
  };

  const handleLogout = async () => {
    localStorage.removeItem('la-isla-authorized');
    localStorage.removeItem('la-isla-user-email');
    setIsAuthorized(false);
    await auth.signOut();
  };

  const seedInitialVillas = async () => {
    console.log('Checking/Seeding inventory...');
    const villaCollection = collection(db, 'villas');
    const existing = await getDocs(villaCollection);
    
    // If we already have the full set, don't seed
    if (existing.size >= 47) return;

    const soldVillas = [5, 6, 8, 9, 11, 18, 22, 23, 24, 27, 28, 30];
    const reservedVillas = [10, 16, 42, 46, 47, 48];

    // Seed missing villas to fill the slots
    const seedPromises = [];
    for (let i = 1; i <= 48; i++) {
        if (i === 13) continue; // Skip 13
        const villaId = `villa_${i.toString().padStart(2, '0')}`;
        
        // Determine status
        let status: 'Available' | 'Sold' | 'Reserved' = 'Available';
        if (soldVillas.includes(i)) status = 'Sold';
        else if (reservedVillas.includes(i)) status = 'Reserved';

        const data = {
            number: i,
            type: i % 5 === 0 ? '4 BHK' : i % 3 === 0 ? '3 BHK' : '2 BHK',
            status: status,
            sqft: 2000 + (i * 100),
            description: `Beautiful Villa ${i} in the heart of South Goa.`
        };
        seedPromises.push(setDoc(doc(db, 'villas', villaId), data));
    }
    
    if (seedPromises.length > 0) {
        console.log(`Seeding ${seedPromises.length} villas...`);
        await Promise.all(seedPromises);
    }
  };

  const allVillas = useMemo(() => {
    const base: Villa[] = [];
    for (let i = 1; i <= 48; i++) {
      if (i === 13) continue;
      const villaId = `villa_${i.toString().padStart(2, '0')}`;
      const realtimeVilla = villas.find(v => v.id === villaId);
      
      base.push(realtimeVilla || {
        id: villaId,
        number: i,
        status: 'Available',
        type: i % 5 === 0 ? '4 BHK' : i % 3 === 0 ? '3 BHK' : '2 BHK',
        sqft: 2000 + (i * 100),
        description: `Beautiful Villa ${i} in the heart of South Goa.`
      });
    }
    return base;
  }, [villas]);

  const selectedVilla = useMemo(() => {
    if (!selectedVillaId) return null;
    return allVillas.find(v => v.id === selectedVillaId) || null;
  }, [selectedVillaId, allVillas]);

  return (
    <div className="relative h-screen w-full bg-[#f4f4f4] overflow-hidden">
      <AnimatePresence>
        {!isAuthorized && <LoginPage onAuthorize={handleAuthorize} />}
      </AnimatePresence>

      <Sidebar 
        map={map} 
        user={user}
        villas={allVillas}
        isMobileExpanded={isMobileExpanded} 
        setIsMobileExpanded={setIsMobileExpanded}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedVillaId={selectedVillaId}
        setSelectedVillaId={setSelectedVillaId}
        setSelectedRenderCategory={setSelectedRenderCategory}
      />
      
      <AnimatePresence>
        {selectedVilla !== null && (
          <FloorPlanModal 
            villa={selectedVilla} 
            onClose={() => setSelectedVillaId(null)} 
          />
        )}
        {selectedRenderCategory !== null && (
          <RenderModal 
            category={selectedRenderCategory} 
            onClose={() => setSelectedRenderCategory(null)} 
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

      <div className="absolute bottom-36 right-4 md:bottom-6 md:right-6 bg-[#3d4a35]/80 backdrop-blur-sm px-4 py-2 rounded-xl text-[9px] font-medium tracking-wide text-white z-[1000] pointer-events-none max-w-[160px] md:max-w-[200px] text-right border border-white/10 shadow-2xl">
        To view the location names, hover over them with your cursor. On mobile, simply tap the location.
      </div>
    </div>
  );
}
