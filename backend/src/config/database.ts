import mongoose from "mongoose";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;

export const connectDB = async () => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL not defined in .env");
  }

  try {
    await mongoose.connect(DATABASE_URL);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};