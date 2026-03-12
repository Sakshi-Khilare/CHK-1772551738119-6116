import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Shield, Users, Building } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-[#eef3f9]">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[#1e3a8a]">
          Ready to <span className="bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">
            Transform
          </span> Your Community?
        </h2>

        <p className="text-lg text-blue-600 mb-12 max-w-2xl mx-auto">
          Join citizens working together to build safer, cleaner communities.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Citizen */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <Users className="h-14 w-14 text-blue-600 mx-auto mb-4"/>

            <h3 className="text-xl font-semibold text-[#1e3a8a] mb-2">
              For Citizens
            </h3>

            <p className="text-gray-600 mb-6">
              Report issues and track community improvements.
            </p>

            <Link to="/signin?role=citizen">
              <Button className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white hover:opacity-90">
                Get Started <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            </Link>
          </div>

          {/* Admin */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <Shield className="h-14 w-14 text-blue-600 mx-auto mb-4"/>

            <h3 className="text-xl font-semibold text-[#1e3a8a] mb-2">
              For Administrators
            </h3>

            <p className="text-gray-600 mb-6">
              Manage reports and track city infrastructure data.
            </p>

            <Link to="/signin?role=admin">
              <Button className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white hover:opacity-90">
                Admin Access <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            </Link>
          </div>

          {/* Department */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition">
            <Building className="h-14 w-14 text-blue-600 mx-auto mb-4"/>

            <h3 className="text-xl font-semibold text-[#1e3a8a] mb-2">
              For Department Staff
            </h3>

            <p className="text-gray-600 mb-6">
              Handle complaints related to water, electricity and sanitation.
            </p>

            <Link to="/signin?role=department">
              <Button className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white hover:opacity-90">
                Department Access <ArrowRight className="ml-2 h-4 w-4"/>
              </Button>
            </Link>
          </div>

        </div>

        {/* Support */}
    

      </div>
    </section>
  );
};

export default CTA;