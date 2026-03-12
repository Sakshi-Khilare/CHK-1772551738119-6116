import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { Button } from "../components/ui/button.tsx";
import { MapPin, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { toast } from "sonner";
import { VITE_BACKEND_URL } from "../config/config.tsx";
import HeaderAfterAuth from "../components/HeaderAfterAuth";

interface Issue {
  _id: string;
  title: string;
  description: string;
  location: { address: string };
  status: string;
  reportDate: string;
}

const DepartmentHome = () => {
  const { token } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(
          `${VITE_BACKEND_URL}/api/v1/department/issues`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setIssues(data.issues);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to load issues");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(
        `${VITE_BACKEND_URL}/api/v1/department/update-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Status updated");
        setIssues((prev) =>
          prev.map((issue) =>
            issue._id === id ? { ...issue, status } : issue
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Error updating status");
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-800";
    if (status === "In Progress") return "bg-blue-100 text-blue-800";
    if (status === "Resolved") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading issues...
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-50">
      <HeaderAfterAuth />

      <div className="pt-20 container mx-auto px-4 space-y-6 max-w-5xl">

        <h1 className="text-2xl font-bold text-blue-900">
          Department Dashboard
        </h1>

        {issues.length === 0 ? (
          <p className="text-center text-blue-700">
            No assigned issues yet
          </p>
        ) : (
          issues.map((issue) => (
            <Card key={issue._id} className="shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  {issue.title}

                  <Badge className={getStatusColor(issue.status)}>
                    {issue.status}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">

                <p className="text-sm text-gray-600">
                  {issue.description}
                </p>

                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>{issue.location?.address}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-pink-500" />
                  <span>
                    {new Date(issue.reportDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Status Buttons */}

                <div className="flex gap-2 pt-2">

                  <Button
                    size="sm"
                    onClick={() =>
                      updateStatus(issue._id, "In Progress")
                    }
                  >
                    In Progress
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      updateStatus(issue._id, "Resolved")
                    }
                  >
                    Resolved
                  </Button>

                </div>

              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentHome;