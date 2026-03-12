import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { VITE_BACKEND_URL } from "../config/config.tsx";

// Department options matching backend enum
const DEPARTMENT_OPTIONS = [
  "Road Infrastructure",
  "Waste Management",
  "Environmental Issues",
  "Utilities & Infrastructure",
  "Public Safety",
  "Other"
];

// Validation error interface from backend
interface ValidationError {
  path: string;
  message: string;
}

interface ApiErrorResponse {
  message: string;
  errors?: ValidationError[];
}

const SignUp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("citizen");

  // Password visibility states
  const [citizenShowPassword, setCitizenShowPassword] = useState(false);
  const [staffShowPassword, setStaffShowPassword] = useState(false);
  const [adminShowPassword, setAdminShowPassword] = useState(false);

  // State to store validation errors for each form
  const [citizenErrors, setCitizenErrors] = useState<ValidationError[]>([]);
  const [staffErrors, setStaffErrors] = useState<ValidationError[]>([]);
  const [adminErrors, setAdminErrors] = useState<ValidationError[]>([]);

  const [citizenForm, setCitizenForm] = useState({
    fullName: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });

  const [staffForm, setStaffForm] = useState({
    fullName: "",
    email: "",
    phonenumber: "",
    department: "",
    departmentAccessCode: "",
    password: "",
    confirmPassword: "",
  });

  const [adminForm, setAdminForm] = useState({
    fullName: "",
    email: "",
    phonenumber: "",
    department: "",
    adminAccessCode: "",
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  // Helper function to get error message for a specific field
  const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
    const error = errors.find(e => e.path === field);
    return error?.message;
  };

  // Clear errors when form field changes
  const clearErrors = (type: "citizen" | "department" | "admin") => {
    if (type === "citizen") setCitizenErrors([]);
    else if (type === "department") setStaffErrors([]);
    else setAdminErrors([]);
  };

  // Unified signup handler
  const handleSignUp = async (type: "citizen" | "department" | "admin", e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous validation errors
    clearErrors(type);

    let formData: any = {};
    let endpoint = "";

    switch (type) {
      case "citizen":
        formData = citizenForm;
        endpoint = `${VITE_BACKEND_URL}/api/v1/citizen/signup`;
        break;
      case "department":
        formData = {
          ...staffForm,
          departmentAccessCode: parseInt(staffForm.departmentAccessCode) || 0
        };
        endpoint = `${VITE_BACKEND_URL}/api/v1/staff/signup`;
        if (!formData.department) {
          setStaffErrors([...staffErrors, { path: "department", message: "Department is required" }]);
          return;
        }
        if (!formData.departmentAccessCode) {
          setStaffErrors([...staffErrors, { path: "departmentAccessCode", message: "Department Access Code is required" }]);
          return;
        }
        break;
      case "admin":
        formData = {
          ...adminForm,
          adminAccessCode: parseInt(adminForm.adminAccessCode) || 0
        };
        endpoint = `${VITE_BACKEND_URL}/api/v1/admin/signup`;
        if (!formData.department) {
          setAdminErrors([...adminErrors, { path: "department", message: "Department is required" }]);
          return;
        }
        if (!formData.adminAccessCode) {
          setAdminErrors([...adminErrors, { path: "adminAccessCode", message: "Admin Access Code is required" }]);
          return;
        }
        break;
      default:
        return;
    }

    if (!validatePassword(formData.password)) {
      const errorMsg = "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character";
      if (type === "citizen") setCitizenErrors([...citizenErrors, { path: "password", message: errorMsg }]);
      else if (type === "department") setStaffErrors([...staffErrors, { path: "password", message: errorMsg }]);
      else setAdminErrors([...adminErrors, { path: "password", message: errorMsg }]);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords do not match";
      if (type === "citizen") setCitizenErrors([...citizenErrors, { path: "confirmPassword", message: errorMsg }]);
      else if (type === "department") setStaffErrors([...staffErrors, { path: "confirmPassword", message: errorMsg }]);
      else setAdminErrors([...adminErrors, { path: "confirmPassword", message: errorMsg }]);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data: ApiErrorResponse = await res.json();

      if (res.ok) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} Registered Successfully!`);
        // Redirect to signin after successful registration
        navigate("/signin");
      } else {
        // Check if there are validation errors from backend
        if (data.errors && data.errors.length > 0) {
          // Map backend errors to the appropriate form
          if (type === "citizen") {
            setCitizenErrors(data.errors);
          } else if (type === "department") {
            setStaffErrors(data.errors);
          } else {
            setAdminErrors(data.errors);
          }
        } else {
          toast.error(data.message || "Signup failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f7f5]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center">
              <img src="/logo.png" className="h-12" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#016dd0] to-[#159e52] bg-clip-text text-transparent">
                UrbanSeva
              </h1>
              <p className="text-sm text-muted-foreground">Building Better Communities</p>
            </div>
          </Link>
        </div>

        <Card className="rounded-2xl shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Join our community</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 rounded-full bg-gray-200 p-1">
                <TabsTrigger value="citizen" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white">Citizen</TabsTrigger>
                <TabsTrigger value="department" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white">Department Staff</TabsTrigger>
                <TabsTrigger value="admin" className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white">Administrator</TabsTrigger>
              </TabsList>

              {/* Citizen Form */}
              <TabsContent value="citizen">
                <motion.div className="mt-6">
                  <form onSubmit={(e) => handleSignUp("citizen", e)} className="space-y-4">
                    <div>
                      <Input 
                        placeholder="Full Name" 
                        onChange={(e) => { setCitizenForm({ ...citizenForm, fullName: e.target.value }); clearErrors("citizen"); }} 
                      />
                      {getFieldError(citizenErrors, "fullName") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(citizenErrors, "fullName")}</p>
                      )}
                    </div>
                    <div>
                      <Input type="email" placeholder="Email" onChange={(e) => { setCitizenForm({ ...citizenForm, email: e.target.value }); clearErrors("citizen"); }} />
                      {getFieldError(citizenErrors, "email") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(citizenErrors, "email")}</p>
                      )}
                    </div>
                    <div>
                      <Input placeholder="Phone Number" onChange={(e) => { setCitizenForm({ ...citizenForm, phonenumber: e.target.value }); clearErrors("citizen"); }} />
                      {getFieldError(citizenErrors, "phonenumber") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(citizenErrors, "phonenumber")}</p>
                      )}
                    </div>
                    <div className="relative">
                      <Input 
                        type={citizenShowPassword ? "text" : "password"} 
                        placeholder="Password" 
                        onChange={(e) => { setCitizenForm({ ...citizenForm, password: e.target.value }); clearErrors("citizen"); }} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setCitizenShowPassword(!citizenShowPassword)}
                      >
                        {citizenShowPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                      </Button>
                      {getFieldError(citizenErrors, "password") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(citizenErrors, "password")}</p>
                      )}
                    </div>
                    <div className="relative">
                      <Input 
                        type={citizenShowPassword ? "text" : "password"} 
                        placeholder="Confirm Password" 
                        onChange={(e) => { setCitizenForm({ ...citizenForm, confirmPassword: e.target.value }); clearErrors("citizen"); }} 
                      />
                      {getFieldError(citizenErrors, "confirmPassword") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(citizenErrors, "confirmPassword")}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white">Create Citizen Account</Button>
                  </form>
                </motion.div>
              </TabsContent>

              {/* Department Staff Form */}
              <TabsContent value="department">
                <motion.div className="mt-6">
                  <form onSubmit={(e) => handleSignUp("department", e)} className="space-y-4">
                    <div>
                      <Input placeholder="Full Name" onChange={(e) => { setStaffForm({ ...staffForm, fullName: e.target.value }); clearErrors("department"); }} />
                      {getFieldError(staffErrors, "fullName") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(staffErrors, "fullName")}</p>
                      )}
                    </div>
                    <div>
                      <Input type="email" placeholder="Official Email" onChange={(e) => { setStaffForm({ ...staffForm, email: e.target.value }); clearErrors("department"); }} />
                      {getFieldError(staffErrors, "email") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(staffErrors, "email")}</p>
                      )}
                    </div>
                    <div>
                      <Input placeholder="Phone Number" onChange={(e) => { setStaffForm({ ...staffForm, phonenumber: e.target.value }); clearErrors("department"); }} />
                      {getFieldError(staffErrors, "phonenumber") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(staffErrors, "phonenumber")}</p>
                      )}
                    </div>
                    <div>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={staffForm.department}
                        onChange={(e) => { setStaffForm({ ...staffForm, department: e.target.value }); clearErrors("department"); }}
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENT_OPTIONS.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {getFieldError(staffErrors, "department") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(staffErrors, "department")}</p>
                      )}
                    </div>
                    <div>
                      <Input type="number" placeholder="Department Access Code" onChange={(e) => { setStaffForm({ ...staffForm, departmentAccessCode: e.target.value }); clearErrors("department"); }} />
                      {getFieldError(staffErrors, "departmentAccessCode") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(staffErrors, "departmentAccessCode")}</p>
                      )}
                    </div>
                    <div>
                      <Input type="password" placeholder="Password" onChange={(e) => { setStaffForm({ ...staffForm, password: e.target.value }); clearErrors("department"); }} />
                      {getFieldError(staffErrors, "password") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(staffErrors, "password")}</p>
                      )}
                    </div>
                    <div>
                      <Input type="password" placeholder="Confirm Password" onChange={(e) => { setStaffForm({ ...staffForm, confirmPassword: e.target.value }); clearErrors("department"); }} />
                      {getFieldError(staffErrors, "confirmPassword") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(staffErrors, "confirmPassword")}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white">Create Staff Account</Button>
                  </form>
                </motion.div>
              </TabsContent>

              {/* Admin Form */}
              <TabsContent value="admin">
                <motion.div className="mt-6">
                  <form onSubmit={(e) => handleSignUp("admin", e)} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Full Name"
                        onChange={(e) => { setAdminForm({ ...adminForm, fullName: e.target.value }); clearErrors("admin"); }}
                      />
                      {getFieldError(adminErrors, "fullName") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(adminErrors, "fullName")}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Official Email"
                        onChange={(e) => { setAdminForm({ ...adminForm, email: e.target.value }); clearErrors("admin"); }}
                      />
                      {getFieldError(adminErrors, "email") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(adminErrors, "email")}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="Phone Number"
                        onChange={(e) => { setAdminForm({ ...adminForm, phonenumber: e.target.value }); clearErrors("admin"); }}
                      />
                      {getFieldError(adminErrors, "phonenumber") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(adminErrors, "phonenumber")}</p>
                      )}
                    </div>
                    <div>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={adminForm.department}
                        onChange={(e) => { setAdminForm({ ...adminForm, department: e.target.value }); clearErrors("admin"); }}
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENT_OPTIONS.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {getFieldError(adminErrors, "department") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(adminErrors, "department")}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Admin Access Code"
                        onChange={(e) => { setAdminForm({ ...adminForm, adminAccessCode: e.target.value }); clearErrors("admin"); }}
                      />
                      {getFieldError(adminErrors, "adminAccessCode") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(adminErrors, "adminAccessCode")}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => { setAdminForm({ ...adminForm, password: e.target.value }); clearErrors("admin"); }}
                      />
                      {getFieldError(adminErrors, "password") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(adminErrors, "password")}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => { setAdminForm({ ...adminForm, confirmPassword: e.target.value }); clearErrors("admin"); }}
                      />
                      {getFieldError(adminErrors, "confirmPassword") && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError(adminErrors, "confirmPassword")}</p>
                      )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white"
                      >
                        Create Admin Account
                      </Button>
                  </form>
                </motion.div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              Already have an account? <Link to="/signin" className="text-primary hover:underline">Sign in here</Link>
            </div>
            <div className="mt-4 flex justify-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Back to Home</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;