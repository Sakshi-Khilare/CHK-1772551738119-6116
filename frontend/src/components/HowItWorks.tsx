import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Camera, MapPin, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const HowItWorks = () => {
  const steps = [
    {
      icon: Camera,
      title: "Capture the Issue",
      description:
        "Take a clear photo of the infrastructure problem using your mobile device or camera.",
      color: "text-blue-600",
    },
    {
      icon: MapPin,
      title: "Add Location Details",
      description:
        "GPS automatically captures the exact location, or manually adjust for precision.",
      color: "text-green-600",
    },
    {
      icon: Send,
      title: "Submit Your Report",
      description:
        "Add a brief description and submit your report to the appropriate authorities.",
      color: "text-purple-600",
    },
    {
      icon: CheckCircle,
      title: "Track Progress",
      description:
        "Monitor the status of your report and receive updates when action is taken.",
      color: "text-orange-600",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
            How It Works
          </h2>

          <p className="text-xl text-blue-700/80 max-w-2xl mx-auto">
            Reporting civic issues is simple and straightforward. Follow these
            steps to make a difference.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-lg rounded-xl p-6 ring-1 ring-white/10 transition-transform hover:scale-[1.02] h-full">

                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      <Icon className={`h-6 w-6 ${step.color}`} />
                    </div>

                    <CardTitle className="text-xl text-blue-900">
                      {step.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-blue-700/80 leading-relaxed">
                      {step.description}
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

export default HowItWorks;