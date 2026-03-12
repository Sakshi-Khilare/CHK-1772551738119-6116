import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MapPin } from "lucide-react";

interface SimpleLocationInputProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  currentAddress?: string;
}

const SimpleLocationInput: React.FC<SimpleLocationInputProps> = ({ 
  onLocationSelect, 
  currentAddress = "" 
}) => {
  const [address, setAddress] = React.useState(currentAddress);
  const [coordinates, setCoordinates] = React.useState({ lat: "", lng: "" });

  const handleAddressSubmit = () => {
    if (address.trim()) {
      // For now, use default coordinates (you can integrate with a geocoding service later)
      const defaultLat = 20.932185; // Default to Bangalore
      const defaultLng = 77.757218;
      onLocationSelect(defaultLat, defaultLng, address);
    }
  };

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(coordinates.lat);
    const lng = parseFloat(coordinates.lng);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
        <p className="text-sm text-blue-800 font-medium">Location Input</p>
        <p className="text-xs text-blue-600 mt-1">
          Enter your location details manually
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="address-input">Address</Label>
          <div className="flex space-x-2">
            <Input
              id="address-input"
              type="text"
              placeholder="Enter full address (e.g., 123 Main St, City, State)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleAddressSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Set
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">OR</div>

        <div>
          <Label>Coordinates</Label>
          <div className="flex space-x-2">
            <Input
              type="number"
              step="any"
              placeholder="Latitude"
              value={coordinates.lat}
              onChange={(e) => setCoordinates(prev => ({ ...prev, lat: e.target.value }))}
              className="flex-1"
            />
            <Input
              type="number"
              step="any"
              placeholder="Longitude"
              value={coordinates.lng}
              onChange={(e) => setCoordinates(prev => ({ ...prev, lng: e.target.value }))}
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleCoordinateSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLocationInput;
