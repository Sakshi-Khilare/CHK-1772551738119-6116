import { Link } from "react-router-dom";
import { Button } from "./ui/button.tsx";
import { LogIn, LogOut, Shield, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.tsx";

type HeaderProps = {
  onFeaturesClick?: () => void;
  onHowItWorksClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  onFeaturesClick,
  onHowItWorksClick,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleContactClick = () => {
    const section = document.getElementById("contact");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-md border-b border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-blue-100">
              <img src="/logo.png" alt="UrbanSeva Logo" className="h-10 w-auto"/>
            </div>

            <div>
              <h1 className="text-xl font-bold text-blue-900">UrbanSeva</h1>
              <p className="text-xs text-blue-600">
                Bridging Citizens & Authorities
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">

            <a
              href="#features"
              className="text-blue-900 font-medium hover:text-blue-600"
              onClick={(e) => {
                e.preventDefault();
                onFeaturesClick && onFeaturesClick();
              }}
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-blue-900 font-medium hover:text-blue-600"
              onClick={(e) => {
                e.preventDefault();
                onHowItWorksClick && onHowItWorksClick();
              }}
            >
              How It Works
            </a>

            <button
              onClick={handleContactClick}
              className="text-blue-900 font-medium hover:text-blue-600"
            >
              Contact
            </button>

            <Link
              to="/sos"
              className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600"
            >
              SOS
            </Link>

          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">

            {user ? (
              <>
                <Link to={user.role === "citizen" ? "/citizen" : "/admin"}>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-1"/>
                    Dashboard
                  </Button>
                </Link>

                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-1"/>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-1"/>
                    Sign In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-500 to-green-400 text-white">
                    <Shield className="h-4 w-4 mr-1"/>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;