import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import { connectDB } from "./database/db.js";
import courseRoutes from "./routes/Courses.js";
import adminRoutes from "./routes/admin.js";
import razorpay from "razorpay";
import cors from "cors";
dotenv.config();
export const rzp = new razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,  // <- REQUIRED for cookies/auth headers
}));

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {

res.send("Hello, World!");}
);

// Allow only your frontend origin




app.use("/uploads", express.static("uploads"));

//importing routes
import userRoutes from "./routes/user.js";

//using routes
app.use("/api/", userRoutes);
app.use("/api/", adminRoutes);
app.use("/api/", courseRoutes);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});