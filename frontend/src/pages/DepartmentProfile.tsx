import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.tsx";
import {
  Avatar,
  AvatarFallback,
} from "../components/ui/avatar.tsx";
import { Mail, Phone, Building } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.tsx";
import HeaderAfterAuth from "../components/HeaderAfterAuth";

const DepartmentProfile = () => {
  const { user } = useAuth();

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-blue-50">
      <HeaderAfterAuth />

      <div className="pt-20 container mx-auto max-w-3xl px-4">

        <Card className="shadow-lg">

          <CardHeader>

            <div className="flex items-center space-x-4">

              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-200 text-blue-800">
                  {user.fullName
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div>
                <CardTitle className="text-xl">
                  Department Staff Profile
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {user.department}
                </p>
              </div>

            </div>

          </CardHeader>

          <CardContent className="space-y-4">

            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>{user.email}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-600" />
              <span>{user.phonenumber}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-purple-600" />
              <span>{user.department}</span>
            </div>

          </CardContent>

        </Card>

      </div>
    </div>
  );
};

export default DepartmentProfile;