import dotenv from "dotenv";
import { connectDB } from "./config/database";
import app from "./app";

// Load environment variables
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;

// Connect to DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed!\n", error);
    process.exit(1);
  });
