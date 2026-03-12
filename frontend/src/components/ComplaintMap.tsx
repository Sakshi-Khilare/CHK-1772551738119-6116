import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

// Fix for default marker icons in React-Leaflet
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Custom red marker icon for complaint locations
const complaintIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Type for complaint data
interface ComplaintData {
  _id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

// Component for handling map clicks
function LocationMarker({ setLocation, selectedLocation }: { setLocation?: (lat: number, lng: number) => void; selectedLocation?: { lat: number; lng: number } | null }) {
  const [position, setPosition] = useState<L.LatLngExpression | null>(null);

  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      if (setLocation) {
        setLocation(lat, lng);
      }
    },
  });

  // Update position when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setPosition([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation]);

  if (!position) return null;

  return (
    <Marker position={position} icon={complaintIcon}>
      <Popup>Complaint Location Selected</Popup>
    </Marker>
  );
}

// Component to display existing complaint markers
function ComplaintMarkers({ complaints }: { complaints: ComplaintData[] }) {
  return (
    <>
      {complaints.map((complaint) => (
        <Marker
          key={complaint._id}
          position={[complaint.location.latitude, complaint.location.longitude]}
          icon={complaintIcon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-sm">{complaint.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{complaint.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

interface ComplaintMapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  complaints?: ComplaintData[];
  height?: string;
  showClickSelection?: boolean;
}

const ComplaintMap: React.FC<ComplaintMapProps> = ({
  onLocationSelect,
  selectedLocation,
  complaints = [],
  height = "400px",
  showClickSelection = true,
}) => {
  // Default center position (India - can be customized)
  const defaultPosition: L.LatLngExpression = [20.932185, 77.757218];

  // Calculate center based on complaints or use default
  const getCenter = (): L.LatLngExpression => {
    if (complaints.length > 0) {
      const firstComplaint = complaints[0];
      return [firstComplaint.location.latitude, firstComplaint.location.longitude];
    }
    if (selectedLocation) {
      return [selectedLocation.lat, selectedLocation.lng];
    }
    return defaultPosition;
  };

  return (
    <MapContainer
      center={getCenter()}
      zoom={complaints.length > 0 ? 13 : 5}
      style={{ height, width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Show complaint markers if provided */}
      <ComplaintMarkers complaints={complaints} />

      {/* Show click-to-select marker if enabled */}
      {showClickSelection && (
        <LocationMarker
          setLocation={onLocationSelect}
          selectedLocation={selectedLocation}
        />
      )}
    </MapContainer>
  );
};

export default ComplaintMap;

