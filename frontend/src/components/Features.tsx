// src/components/ui/Features.tsx
import { MessageCircle, MapPin, Bell, Camera, User, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Smart Chatbot",
      description:
        "Interact with our chatbot to report civic issues quickly and easily, anytime.",
      color: "text-blue-600",
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description:
        "Track your submitted requests in real-time and see the progress instantly.",
      color: "text-green-600",
    },
    {
      icon: Bell,
      title: "Notifications",
      description:
        "Receive instant updates whenever the status of your request changes.",
      color: "text-orange-600",
    },
    {
      icon: Camera,
      title: "Photo Upload",
      description:
        "Capture and upload photos of issues for accurate reporting and faster resolution.",
      color: "text-purple-600",
    },
    {
      icon: User,
      title: "Citizen Portal",
      description:
        "Submit service requests for water, electricity, sanitation, and more in one place.",
      color: "text-indigo-600",
    },
    {
      icon: Shield,
      title: "Admin Dashboard",
      description:
        "Manage reports, assign tasks, and monitor city-wide service efficiency.",
      color: "text-red-600",
    },
  ];

  return (
    <section id="features" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
            Features Designed for UrbanSeva
          </h2>
          <p className="text-xl text-blue-700/80 max-w-2xl mx-auto">
            Tools to report, track, and resolve city issues efficiently, keeping citizens and authorities connected.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon; // TypeScript-safe
            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
              >
                <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-lg rounded-xl p-6 ring-1 ring-white/10 transition-transform hover:scale-[1.02]">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl text-blue-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-700/80 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;