import { useCallback, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { ArrowLeft, MapPin, Upload, Send, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MapComponent from "../components/MapBox";
import SimpleLocationInput from "../components/SimpleLocationInput";
import ComplaintMap from "../components/ComplaintMap";
import { toast } from "sonner";
import { VITE_BACKEND_URL } from "../config/config";
import EXIF from "exif-js";

const ReportIssue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    issueDescription: "",
    issueLocation: "",
    issueType: "Road Infrastructure",
    location: {
      address: "",
      latitude: null as number | null,
      longitude: null as number | null,
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapAvailable, setMapAvailable] = useState(true);
  const [useLeafletMap, setUseLeafletMap] = useState(true); // Toggle between Mapbox and Leaflet
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle location from Mapbox (with address)
  const handleLocationSelect = useCallback(
    (lat: number, lng: number, address: string) => {
      setFormData((prev) => ({
        ...prev,
        location: { address, latitude: lat, longitude: lng },
        issueLocation: address,
      }));
    },
    []
  );

  // Handle location from Leaflet (without address - just coordinates)
  const handleLeafletLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setFormData((prev) => ({
        ...prev,
        location: { 
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, 
          latitude: lat, 
          longitude: lng 
        },
        issueLocation: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      }));
      toast.success("Location selected! You can now add an address manually.");
    },
    []
  );

  // ------------------- File Upload with Geo -------------------
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Read GPS data from EXIF
    EXIF.getData(file, function () {
      const lat = EXIF.getTag(this, "GPSLatitude");
      const lon = EXIF.getTag(this, "GPSLongitude");
      const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
      const lonRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";

      if (lat && lon) {
        const latitude =
          (lat[0] + lat[1] / 60 + lat[2] / 3600) * (latRef === "S" ? -1 : 1);
        const longitude =
          (lon[0] + lon[1] / 60 + lon[2] / 3600) * (lonRef === "W" ? -1 : 1);

        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, latitude, longitude },
        }));

        toast.success("Photo location detected automatically!");
      }
    });
  };

  // ------------------- Camera Functions -------------------
  const startCamera = async () => {
    setCameraOpen(true);
    if (navigator.mediaDevices && videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "photo.png", { type: "image/png" });
      setSelectedFile(file);
      toast.success("Photo captured successfully!");
      setCameraOpen(false);

      // Stop camera
      const stream = videoRef.current!.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.issueDescription || !formData.location.address) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.issueDescription);
      data.append("issueType", formData.issueType);
      data.append("location", JSON.stringify(formData.location));
      if (selectedFile) data.append("files", selectedFile);

      const response = await fetch(`${VITE_BACKEND_URL}/api/v1/citizen/create-issue`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Issue reported successfully!");
        navigate("/citizen");
      } else {
        toast.error(result.message || "Failed to report issue");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const issueTypes = [
    { value: "Road Infrastructure", label: "Road Infrastructure" },
    { value: "Waste Management", label: "Waste Management" },
    { value: "Environmental Issues", label: "Environmental Issues" },
    { value: "Utilities & Infrastructure", label: "Utilities & Infrastructure" },
    { value: "Public Safety", label: "Public Safety" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f6f8]">
      {/* Header */}
      <header className="w-full border-b bg-white/10 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/citizen">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-slate-500">
                <ArrowLeft className="h-4 w-4 text-blue-600" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-cyan-600">Report New Issue</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
<Card className="h-fit shadow-lg bg-white/80">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>Select Issue Location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setUseLeafletMap(!useLeafletMap)} 
                    className="text-xs text-blue-600 hover:text-blue-800 underline mr-2"
                  >
                    {useLeafletMap ? "Use Mapbox" : "Use OpenStreetMap"}
                  </button>
                  {mapAvailable && (
                    <button type="button" onClick={() => setMapAvailable(false)} className="text-xs text-blue-600 hover:text-blue-800 underline">
                      Use manual input
                    </button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden border">
                {mapAvailable ? (
                  useLeafletMap ? (
                    <ComplaintMap 
                      onLocationSelect={handleLeafletLocationSelect} 
                      selectedLocation={formData.location.latitude && formData.location.longitude ? { lat: formData.location.latitude, lng: formData.location.longitude } : null}
                      height="100%"
                    />
                  ) : (
                    <MapComponent onLocationSelect={handleLocationSelect} onMapError={() => setMapAvailable(false)} />
                  )
                ) : (
                  <SimpleLocationInput onLocationSelect={handleLocationSelect} currentAddress={formData.location.address} />
                )}
              </div>
              {formData.location.latitude && formData.location.longitude && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card className="shadow-lg bg-white/80 text-slate-600">
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input id="title" type="text" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="Enter your issue title" required className="shadow-sm" />
                </div>

                {/* Issue Type */}
                <div className="space-y-2">
                  <Label>Issue Type *</Label>
                  <RadioGroup value={formData.issueType} onValueChange={(value) => handleInputChange("issueType", value)} className="grid grid-cols-2 gap-4">
                    {issueTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value} className="text-sm">{type.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="issueLocation">Issue Location Address</Label>
                  <Input id="issueLocation" type="text" value={formData.issueLocation} onChange={(e) => handleInputChange("issueLocation", e.target.value)} placeholder="Enter or select location on map" className="shadow-sm" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="issueDescription">Issue Description *</Label>
                  <Textarea id="issueDescription" value={formData.issueDescription} onChange={(e) => handleInputChange("issueDescription", e.target.value)} placeholder="Describe the issue in detail..." className="min-h-24 shadow-sm" required />
                </div>

                {/* Upload & Camera */}
                <div className="space-y-2">
                  <Label>Upload Image/Video</Label>
                  <div className="flex items-center space-x-2">
                    <Input type="file" accept="image/*,video/*" onChange={handleFileChange} className="flex-1" />
                    <Upload className="h-5 w-5 text-blue-600" />
                    <Button type="button" onClick={startCamera} className="w-40 bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white hover:opacity-70">
                      <Camera className="h-4 w-4" /> Open Camera
                    </Button>
                  </div>
                  {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
                </div>

                {/* Camera Preview */}
                {cameraOpen && (
                  <div className="flex flex-col items-center space-y-2 mt-2">
                    <video ref={videoRef} className="w-full max-w-md rounded border" autoPlay />
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    <Button type="button" onClick={takePhoto} className="w-40 bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white hover:opacity-70">Take Photo</Button>
                    <Button type="button" onClick={() => setCameraOpen(false)} className="w-40 bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white hover:opacity-70">Cancel</Button>
                  </div>
                )}

                {/* Submit */}
                <Button type="submit" className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white hover:opacity-70" disabled={loading} size="lg">
                  {loading ? "Submitting..." : <><Send className="h-5 w-5 mr-2" /> Submit Issue</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportIssue;