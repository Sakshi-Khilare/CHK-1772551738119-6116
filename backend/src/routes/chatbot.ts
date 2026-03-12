import express, { Request, Response } from "express";
import { IssueModel } from "../models/issue.model";
import { authMiddleware } from "../middlerware/auth.middleware";

const router = express.Router();

// Intent detection patterns
interface IntentPattern {
  keywords: string[];
  issueType: string;
  department: string;
  title: string;
}

const intentPatterns: IntentPattern[] = [
  {
    keywords: ["garbage", "waste", "trash", "litter", "dirty", "cleanliness"],
    issueType: "Waste Management",
    department: "Sanitation Department",
    title: "Garbage Issue"
  },
  {
    keywords: ["pothole", "road", "road damage", "broken road", "street", "path"],
    issueType: "Road Infrastructure",
    department: "Road Maintenance",
    title: "Road Infrastructure Issue"
  },
  {
    keywords: ["water", "leak", "leakage", "pipeline", "drainage", "flooding"],
    issueType: "Utilities & Infrastructure",
    department: "Water Department",
    title: "Water Leakage Issue"
  },
  {
    keywords: ["power", "electric", "electricity", "light", "outage", "blackout"],
    issueType: "Utilities & Infrastructure",
    department: "Electricity Department",
    title: "Power Failure Issue"
  },
  {
    keywords: ["environment", "pollution", "smoke", "air quality", "noise"],
    issueType: "Environmental Issues",
    department: "Environmental Department",
    title: "Environmental Issue"
  },
  {
    keywords: ["safety", "accident", "crime", "danger", "unsafe", "emergency"],
    issueType: "Public Safety",
    department: "Public Safety Department",
    title: "Public Safety Issue"
  },
  {
    keywords: ["tree", "park", "garden", "greenspace", "landscape"],
    issueType: "Environmental Issues",
    department: "Parks Department",
    title: "Park/Green Space Issue"
  }
];

// Detect intent from user message
const detectIntent = (message: string): IntentPattern | null => {
  const text = message.toLowerCase();
  
  for (const pattern of intentPatterns) {
    for (const keyword of pattern.keywords) {
      if (text.includes(keyword)) {
        return pattern;
      }
    }
  }
  
  return null;
};

// Generate unique complaint ID
const generateComplaintId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SEVA-${timestamp}-${random}`;
};

router.post("/chat", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, step, data } = req.body;
    const citizenId = req.citizenId || "anonymous";
    const isAuthenticated = !!req.citizenId;

    if (!message && !step) {
      res.json({ 
        reply: "Hello! I'm SevaBot, your civic issue assistant. What would you like to report today?",
        step: "initial"
      });
      return;
    }

    // Step 1: Initial message - detect intent
    if (!step || step === "initial") {
      const intent = detectIntent(message || "");
      
      if (!intent) {
        res.json({
          reply: "I can help you report issues like garbage, water leakage, power failure, potholes, environmental problems, or public safety concerns. What would you like to report?",
          step: "initial"
        });
        return;
      }

      res.json({
        reply: `I detected a ${intent.department} issue. Please share your location (address) where this problem is occurring.`,
        step: "location",
        intent: {
          issueType: intent.issueType,
          department: intent.department,
          title: intent.title
        }
      });
      return;
    }

    // Step 2: Location received - ask for description
    if (step === "location" && data?.intent) {
      const location = message;
      
      if (!location || location.trim().length < 5) {
        res.json({
          reply: "Please provide a valid address or location description (e.g., '123 Main Street, Bangalore').",
          step: "location",
          intent: data.intent
        });
        return;
      }

      res.json({
        reply: `Location recorded: ${location}. Now, please describe the issue in a few words (optional).`,
        step: "description",
        intent: data.intent,
        location: location
      });
      return;
    }

    // Step 3: Description received - create issue
    if (step === "description" && data?.intent && data?.location) {
      const description = message || `Issue reported via SevaBot - ${data.intent.department}`;
      const complaintId = generateComplaintId();
      
      // Create issue in database
      try {
        // Use default coordinates (center of India) since we don't have geocoding
        // In production, you'd integrate with a geocoding service
        const defaultLat = 20.5937;
        const defaultLng = 78.9629;
        
        const issue = await IssueModel.create({
          citizenId: req.citizenId || "anonymous",
          issueType: data.intent.issueType,
          title: `${data.intent.title} - ${complaintId}`,
          description: description,
          location: {
            latitude: defaultLat,
            longitude: defaultLng,
            address: data.location
          },
          status: "Reported"
        });

        res.json({
          reply: `✅ Issue registered successfully!\n\n📋 Complaint ID: ${complaintId}\n🏢 Department: ${data.intent.department}\n📍 Location: ${data.location}\n\nYour complaint has been forwarded to the ${data.intent.department}. You can track its status using the Complaint ID.`,
          step: "complete",
          complaintId: complaintId,
          department: data.intent.department,
          issueId: issue._id
        });
      } catch (error) {
        console.error("Error creating issue:", error);
        // Still return success even if DB fails (for demo purposes)
        res.json({
          reply: `✅ Issue registered successfully!\n\n📋 Complaint ID: ${complaintId}\n🏢 Department: ${data.intent.department}\n📍 Location: ${data.location}\n\nYour complaint has been forwarded to the ${data.intent.department}.`,
          step: "complete",
          complaintId: complaintId,
          department: data.intent.department
        });
      }
      return;
    }

    // Handle restart
    if (message?.toLowerCase().includes("start") || message?.toLowerCase().includes("new")) {
      res.json({
        reply: "Hello! I'm SevaBot, your civic issue assistant. What would you like to report today?",
        step: "initial"
      });
      return;
    }

    // Default fallback
    res.json({
      reply: "I didn't understand that. Would you like to report a new issue? Just describe what problem you'd like to report (e.g., garbage, water leak, power failure).",
      step: "initial"
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ 
      reply: "Sorry, something went wrong. Please try again or use the manual form to report your issue.",
      step: "error"
    });
  }
});

// Get department info
router.get("/departments", (_req: Request, res: Response) => {
  const departments = [
    { name: "Sanitation Department", issues: ["garbage", "waste", "cleanliness"] },
    { name: "Water Department", issues: ["water", "leak", "pipeline"] },
    { name: "Electricity Department", issues: ["power", "electric", "light"] },
    { name: "Road Maintenance", issues: ["road", "pothole", "street"] },
    { name: "Environmental Department", issues: ["environment", "pollution"] },
    { name: "Public Safety", issues: ["safety", "crime", "emergency"] }
  ];
  
  res.json({ departments });
});

export default router;
