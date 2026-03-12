import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useLoader } from "../contexts/LoaderContext";

const SignIn = () => {
  const [citizenShowPassword, setCitizenShowPassword] = useState(false);
  const [adminShowPassword, setAdminShowPassword] = useState(false);
  const [staffShowPassword, setStaffShowPassword] = useState(false);

  const [citizenForm, setCitizenForm] = useState({
    email: "",
    password: "",
  });

  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    adminAccessCode: "",
  });

  const [staffForm, setStaffForm] = useState({
    email: "",
    password: "",
    departmentAccessCode: "",
  });

  const [activeTab, setActiveTab] = useState<
    "citizen" | "admin" | "staff"
  >("citizen");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { showLoader, hideLoader } = useLoader();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();

    const minLoaderDuration = new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );

    try {
      let result: boolean;

      if (activeTab === "citizen") {
        result = await Promise.all([
          login(citizenForm.email, citizenForm.password, "citizen"),
          minLoaderDuration,
        ]).then(([res]) => res);
      } else if (activeTab === "admin") {
        result = await Promise.all([
          login(
            adminForm.email,
            adminForm.password,
            "admin",
            adminForm.adminAccessCode
          ),
          minLoaderDuration,
        ]).then(([res]) => res);
      } else {
        result = await Promise.all([
          login(
            staffForm.email,
            staffForm.password,
            "department",
            staffForm.departmentAccessCode
          ),
          minLoaderDuration,
        ]).then(([res]) => res);
      }

      if (result === true) {
        toast.success("Sign In Successful!", {
          description:
            activeTab === "citizen"
              ? "Welcome back!"
              : activeTab === "admin"
              ? "Welcome back, Administrator!"
              : "Welcome back, Department Staff!",
        });

        navigate(
          activeTab === "citizen"
            ? "/citizen"
            : activeTab === "admin"
            ? "/admin"
            : "/department-dashboard",
          { replace: true }
        );
      } else {
        toast.error("Sign In Failed!", {
          description: "Invalid credentials",
        });
        hideLoader();
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign In Failed!", {
        description: "Something went wrong",
      });
      hideLoader();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#f0f7f5]" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow">
              <img src="/logo.png" alt="Civic Voice Logo" className="h-12 w-auto"/>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#016dd0] to-[#159e52] bg-clip-text text-transparent">
                UrbanSeva
              </h1>
              <p className="text-sm text-muted-foreground">
                Building Better Communities
              </p>
            </div>
          </Link>
        </div>

        <Card className="rounded-2xl shadow-2xl bg-white border-0">
          <CardHeader>
            <CardTitle>
              <center>Sign In</center>
            </CardTitle>
            <CardDescription>
              Access your account to report issues or manage community reports
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as any)}
            >
              {/* Tabs */}
              <TabsList className="grid w-full grid-cols-3 rounded-full bg-gray-100 p-1">
                <TabsTrigger
                  value="citizen"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white"
                >
                  Citizen
                </TabsTrigger>

 <TabsTrigger
                  value="staff"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white"
                >
                  Department Staff
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white"
                >
                  Administrator
                </TabsTrigger>

               
              </TabsList>

              <AnimatePresence mode="wait">

                {/* Citizen */}
                {activeTab === "citizen" && (
                  <TabsContent value="citizen" forceMount>
                    <motion.div
                      key="citizen"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={citizenForm.email}
                          onChange={(e) =>
                            setCitizenForm({
                              ...citizenForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />

                        <Label>Password</Label>
                        <div className="relative">
                          <Input
                            type={citizenShowPassword ? "text" : "password"}
                            value={citizenForm.password}
                            onChange={(e) =>
                              setCitizenForm({
                                ...citizenForm,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setCitizenShowPassword(!citizenShowPassword)}
                          >
                            {citizenShowPassword ? (
                              <EyeOff className="h-4 w-4"/>
                            ) : (
                              <Eye className="h-4 w-4"/>
                            )}
                          </Button>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white hover:opacity-70"
                        >
                          Sign In as Citizen
                        </Button>
                      </form>
                    </motion.div>
                  </TabsContent>
                )}

                {/* Admin */}
                {activeTab === "admin" && (
                  <TabsContent value="admin" forceMount>
                    <motion.div
                      key="admin"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={adminForm.email}
                          onChange={(e) =>
                            setAdminForm({
                              ...adminForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />

                        <Label>Password</Label>
                        <div className="relative">
                          <Input
                            type={adminShowPassword ? "text" : "password"}
                            value={adminForm.password}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setAdminShowPassword(!adminShowPassword)}
                          >
                            {adminShowPassword ? (
                              <EyeOff className="h-4 w-4"/>
                            ) : (
                              <Eye className="h-4 w-4"/>
                            )}
                          </Button>
                        </div>

                        <Label>Admin Code</Label>
                        <Input
                          type="number"
                          value={adminForm.adminAccessCode}
                          onChange={(e) =>
                            setAdminForm({
                              ...adminForm,
                              adminAccessCode: e.target.value,
                            })
                          }
                          required
                        />

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white hover:opacity-70"
                        >
                          Sign In as Administrator
                        </Button>
                      </form>
                    </motion.div>
                  </TabsContent>
                )}

                {/* Department Staff */}
                {activeTab === "staff" && (
                  <TabsContent value="staff" forceMount>
                    <motion.div
                      key="staff"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={staffForm.email}
                          onChange={(e) =>
                            setStaffForm({
                              ...staffForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />

                        <Label>Password</Label>
                        <div className="relative">
                          <Input
                            type={staffShowPassword ? "text" : "password"}
                            value={staffForm.password}
                            onChange={(e) =>
                              setStaffForm({
                                ...staffForm,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setStaffShowPassword(!staffShowPassword)}
                          >
                            {staffShowPassword ? (
                              <EyeOff className="h-4 w-4"/>
                            ) : (
                              <Eye className="h-4 w-4"/>
                            )}
                          </Button>
                        </div>

                        <Label>Department Code</Label>
                        <Input
                          type="number"
                          value={staffForm.departmentAccessCode}
                          onChange={(e) =>
                            setStaffForm({
                              ...staffForm,
                              departmentAccessCode: e.target.value,
                            })
                          }
                          required
                        />

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white hover:opacity-70"
                        >
                          Sign In as Department Staff
                        </Button>
                      </form>
                    </motion.div>
                  </TabsContent>
                )}

              </AnimatePresence>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up here
                  </Link>
                </p>

                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  ← Back to Home
                </Link>
              </div>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;