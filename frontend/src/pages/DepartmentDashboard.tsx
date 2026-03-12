import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { VITE_BACKEND_URL } from "../config/config";
import { toast } from "sonner";
import HeaderAfterAuth from "../components/HeaderAfterAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import ComplaintMap from "../components/ComplaintMap";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye,
  MapPin,
  User,
  Calendar,
  List,
  Map
} from "lucide-react";

interface Issue {
  _id: string;
  title: string;
  description: string;
  type: string;
  location: {
    address?: string;
    latitude: number;
    longitude: number;
  };
  reportedBy: string;
  reportedAt: string;
  image: string | null;
  status: string;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Reported: { color: "bg-red-500", icon: <AlertCircle className="h-4 w-4" /> },
  Pending: { color: "bg-yellow-500", icon: <Clock className="h-4 w-4" /> },
  "In Progress": { color: "bg-blue-500", icon: <Clock className="h-4 w-4" /> },
  Resolved: { color: "bg-green-500", icon: <CheckCircle2 className="h-4 w-4" /> },
  Rejected: { color: "bg-gray-500", icon: <XCircle className="h-4 w-4" /> },
};

const DepartmentDashboard = () => {
  const { user, token } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  useEffect(() => {
    fetchDepartmentIssues();
  }, []);

  const fetchDepartmentIssues = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      console.log("Token from localStorage:", token);
      
      if (!token) {
        toast.error("Not authenticated. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${VITE_BACKEND_URL}/api/v1/staff/issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setIssues(data.issues || []);
      } else {
        toast.error(data.message || "Failed to fetch issues");
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast.error("Failed to fetch issues");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (issueId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        toast.error("Not authenticated. Please login again.");
        return;
      }

      const response = await fetch(
        `${VITE_BACKEND_URL}/api/v1/staff/issues/${issueId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Issue status updated");
        fetchDepartmentIssues();
        setSelectedIssue(null);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.Reported;
    return (
      <Badge className={`${config.color} text-white hover:${config.color}`}>
        {config.icon}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <HeaderAfterAuth />

      <div className="pt-20 container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.department} Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and track issues reported for your department
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Issues</p>
                  <p className="text-2xl font-bold">{issues.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">
                    {issues.filter((i) => i.status === "Pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">
                    {issues.filter((i) => i.status === "In Progress").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold">
                    {issues.filter((i) => i.status === "Resolved").length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

{/* Issues List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Department Issues</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "map" ? (
              <div className="h-[500px] rounded-lg overflow-hidden border">
                <ComplaintMap 
                  complaints={issues}
                  showClickSelection={false}
                  height="100%"
                />
              </div>
            ) : loading ? (
              <div className="text-center py-8">Loading issues...</div>
            ) : issues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No issues found for your department
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div
                    key={issue._id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    {/* Image */}
                    {issue.image && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={issue.image}
                          alt={issue.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg truncate">
                          {issue.title}
                        </h3>
                        {getStatusBadge(issue.status)}
                      </div>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {issue.reportedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(issue.reportedAt).toLocaleDateString()}
                        </span>
                        {issue.location?.address && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {issue.location.address}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {issue.status === "Reported" && (
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => updateStatus(issue._id, "In Progress")}
                        >
                          Start
                        </Button>
                      )}
                      {issue.status === "In Progress" && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => updateStatus(issue._id, "Resolved")}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>{selectedIssue.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIssue(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedIssue.image && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedIssue.image}
                    alt={selectedIssue.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-gray-600">{selectedIssue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Status</h4>
                  {getStatusBadge(selectedIssue.status)}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Type</h4>
                  <p className="text-gray-600">{selectedIssue.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Reported By</h4>
                  <p className="text-gray-600">{selectedIssue.reportedBy}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Date</h4>
                  <p className="text-gray-600">
                    {new Date(selectedIssue.reportedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedIssue.location?.address && (
                <div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p className="text-gray-600">{selectedIssue.location.address}</p>
                  <p className="text-sm text-gray-500">
                    Lat: {selectedIssue.location.latitude}, Lng: {selectedIssue.location.longitude}
                  </p>
                </div>
              )}

              {/* Status Update Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedIssue.status === "Reported" && (
                  <>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={() => updateStatus(selectedIssue._id, "In Progress")}
                    >
                      Mark In Progress
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300"
                      onClick={() => updateStatus(selectedIssue._id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {selectedIssue.status === "In Progress" && (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => updateStatus(selectedIssue._id, "Resolved")}
                    >
                      Mark Resolved
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300"
                      onClick={() => updateStatus(selectedIssue._id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {(selectedIssue.status === "Resolved" || selectedIssue.status === "Rejected") && (
                  <Button
                    variant="outline"
                    onClick={() => updateStatus(selectedIssue._id, "Reported")}
                  >
                    Reopen
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;

