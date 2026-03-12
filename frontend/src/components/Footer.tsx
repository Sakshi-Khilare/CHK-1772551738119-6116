// src/components/ui/Footer.tsx
import { MapPin, Mail, Phone } from "lucide-react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-r from-blue-900 via-blue-700 to-emerald-500 text-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white">
                <img src={logo} alt="UrbanSeva Logo" className="h-8 w-auto" />
              </div>

              <h3 className="text-lg font-bold">UrbanSeva</h3>
            </div>

            <p className="text-white/90">
              Connecting citizens with authorities for efficient city service
              requests, real-time updates, and community support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>

            <ul className="space-y-2">

              <Link to="/citizen-portal">
                <li className="text-white/80 hover:text-white transition-colors">
                  Citizen Portal
                </li>
              </Link>

              <Link to="/department-dashboard">
                <li className="text-white/80 hover:text-white transition-colors">
                  Department Dashboard
                </li>
              </Link>

              <Link to="/admin-dashboard">
                <li className="text-white/80 hover:text-white transition-colors">
                  Admin Dashboard
                </li>
              </Link>

              <a
                href="#how-it-works"
                className="text-white/80 hover:text-white transition-colors"
              >
                How It Works
              </a>

            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>

            <ul className="space-y-2">

              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                Help Center
              </a>

              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
              >
                Terms of Service
              </a>

              <a
                href="#contact"
                className="text-white/80 hover:text-white transition-colors"
              >
                Contact Us
              </a>

            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">

            <h4 className="text-lg font-semibold">Contact</h4>

            <div className="space-y-3">

              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-white/80" />
                <span className="text-white/80">
                  support@urbanseva.com
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-white/80" />
                <span className="text-white/80">
                  +91 9876543210
                </span>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-white/80 mt-1" />
                <span className="text-white/80">
                  UrbanSeva Office <br />
                  Smart City, State, 123456
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/80">
            © 2026 UrbanSeva. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;