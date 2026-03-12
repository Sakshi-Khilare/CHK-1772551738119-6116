import React from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const emergencyNumbers = [
  { title: "Police Emergency", number: "100", desc: "Police assistance and law enforcement" },
  { title: "Fire Emergency", number: "101", desc: "Fire brigade and rescue services" },
  { title: "Medical Emergency / Ambulance", number: "102", desc: "Ambulance and medical assistance" },
  { title: "Women Helpline", number: "1091", desc: "24x7 helpline for women in distress" },
  { title: "Child Helpline", number: "1098", desc: "Child protection and assistance" },
  { title: "Disaster Management (NDMA)", number: "1078", desc: "Emergency response for natural disasters" },
  { title: "Road Accident Emergency", number: "1073", desc: "Emergency response for road accidents" },
  { title: "Railway Helpline", number: "139", desc: "Railway security and emergencies" },
  { title: "Gas Leakage Emergency", number: "1906", desc: "Emergency helpline for LPG gas leakage" },
  { title: "Senior Citizens Helpline", number: "14567", desc: "Assistance and safety for senior citizens" },
  { title: "Mental Health Helpline", number: "1800-599-0019", desc: "Support for mental health and counseling" },
];

const SOS: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-700 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🚨 Emergency SOS</h1>
          <p className="text-sm">Help is available 24/7 • Stay Safe</p>
        </div>
        <div className="bg-red-800 px-4 py-2 rounded-md text-sm font-mono">
          {new Date().toLocaleTimeString()}
        </div>
      </header>

    

      {/* Emergency Numbers */}
      <section className="m-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-red-700">
          ☎️ Emergency Numbers
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {emergencyNumbers.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-black tracking-wide">
                    {item.number}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Copy number"
                  className="p-2 rounded-md hover:bg-gray-100 active:scale-95 transition"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(item.number);
                      toast.success("Number copied", { position: "top-center" });
                    } catch (err) {
                      toast.error("Failed to copy", { position: "top-center" });
                    }
                  }}
                >
                  <Copy className="h-5 w-5 text-gray-700" />
                </button>
                <a
                  href={`tel:${item.number}`}
                  className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700"
                >
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SOS;
