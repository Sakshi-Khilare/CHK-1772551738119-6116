// src/components/Hero.tsx
import { ArrowRight, Camera, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SevaBot from "./SevaBot";


const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-16 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
                Transform
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400 px-2 rounded-lg">
                  Report Issues,
                </span>
                <br />
                Urban Governance
              </h1>
              <p className="text-xl text-blue-700/80 max-w-lg">
                A unified platform for efficient civic service delivery, 
                transparent complaint handling, AI-powered chatbot assistance, 
                real-time complaint tracking, and seamless coordination between government departments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">

  {/* Report Issue + Sevabot */}
  <div className="flex flex-col gap-2">
    <Link
      to={
        user?.role === "citizen"
          ? "/citizen/create-issue"
          : user?.role === "admin"
          ? "/"
          : "/signin"
      }
    >
      <Button
        size="lg"
        className="relative bg-gradient-to-r from-blue-700 to-green-400 border-0 text-white flex items-center space-x-2 cursor-pointer 
          overflow-hidden px-6 py-3 shadow-lg transition-all duration-300 ease-out
          hover:scale-[1.04] hover:shadow-xl group"
      >
        <Camera className="h-5 w-5 transition-transform duration-500 group-hover:-translate-y-0.5" />
        <span className="relative z-10">Report an Issue</span>
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </Link>

    {/* Sevabot button below */}
    <div>
  <SevaBot/>
</div>
  </div>

  {/* View Reports */}
  <Link to={user?.role === "citizen" ? "/citizen" : "/admin"}>
    <Button
      variant="outline"
      size="lg"
      className="flex items-center space-x-2 cursor-pointer border-blue-500 text-blue-700 hover:bg-blue-50"
    >
      <MapPin className="h-5 w-5 text-green-600" />
      <span>View Reports</span>
    </Button>
  </Link>

</div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-blue-200 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-900">2,847</div>
                <div className="text-sm text-blue-700/70">Issues Resolved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">15,239</div>
                <div className="text-sm text-blue-700/70">Active Citizens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">48h</div>
                <div className="text-sm text-blue-700/70">Avg Response</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-in-right">
            <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="hero_img.png"
                alt="Infrastructure and community"
                className="w-full h-[550px] object-cover transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]
                 group-hover:scale-[1.06] group-hover:rotate-[0.6deg] group-hover:brightness-95"
              />

              <div
                className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-black/10 opacity-0
                   transition-opacity duration-700 ease-out group-hover:opacity-100"
              />

              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/10 blur-md opacity-0
                  transition-opacity duration-700 group-hover:opacity-100 group-hover:animate-hero-shine"
              />

              <div
                className="pointer-events-none absolute inset-0 ring-0 ring-white/0 group-hover:ring-1 group-hover:ring-white/30
                  transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;