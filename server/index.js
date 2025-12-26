import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env explicitly
dotenv.config({ path: path.join(__dirname, ".env") });

// HARD CHECK
if (!process.env.SUPABASE_URL) {
  console.error("❌ SUPABASE_URL NOT LOADED");
  process.exit(1);
}

console.log("✅ ENV LOADED");

// ---- normal imports AFTER env ----
import express from "express";
import cors from "cors";
import razorpay from "razorpay";

import { connectDB } from "./database/db.js";
import courseRoutes from "./routes/Courses.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";

export const rzp = new razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors({ credentials: true }));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/", userRoutes);
app.use("/api/", adminRoutes);
app.use("/api/", courseRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on ${port}`);
  connectDB();
});
