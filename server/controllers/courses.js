import { Course } from "../models/Course.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/user.js";
import { rzp } from "../index.js";
import { Payment } from "../models/payments.js";
import crypto from "crypto";
import { Progress } from "../models/Progress.js";

import { uploadToSupabase } from "../utils/uploadtosupabase.js"; // 🆕
import { getSupabase } from "../database/supabase.js";               // 🆕

/* ================= COURSES ================= */

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Course.find();
  res.json({ courses });
});

export const getCourseDetails = TryCatch(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json({ course });
});

/* ================= LECTURES ================= */

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });
  const user = await User.findById(req.user._id);

  if (user.role === "admin") return res.json({ lectures });

  if (!user.subscription.includes(req.params.id)) {
    return res.status(400).json({ message: "You have not subscribed to this course" });
  }

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  console.log("=== Fetch Lecture ===");
  console.log("Lecture ID from params:", req.params.id);
  console.log("Authenticated user:", req.user);

  if (!req.user || !req.user._id) {
    console.error("No authenticated user found in request");
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch lecture from DB
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    console.error("Lecture not found in DB");
    return res.status(404).json({ message: "Lecture not found" });
  }
  console.log("Lecture found:", lecture.title);

  // Fetch user from DB
  const user = await User.findById(req.user._id);
  if (!user) {
    console.error("User not found in DB");
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check subscription
  if (user.role !== "admin" && !user.subscription.includes(lecture.course.toString())) {
    console.error("User not subscribed to this course");
    return res.status(403).json({ message: "You have not subscribed to this course" });
  }

  // Generate Supabase signed URL if video is not a full URL
  let videoUrl = lecture.video;
  if (!videoUrl.startsWith("http")) {
    try {
      const { data, error } = await getSupabase().storage
        .from("lectures")
        .createSignedUrl(videoUrl, 60 * 60);

      if (error) {
        console.error("Error generating Supabase signed URL:", error);
      } else {
        videoUrl = data.signedUrl;
      }
    } catch (err) {
      console.error("Supabase URL generation failed:", err);
    }
  }

  console.log("Returning lecture with video URL:", videoUrl);

  res.json({
    lecture: {
      ...lecture._doc,
      video: videoUrl,
    },
  });
});


/* ================= ADD LECTURE (ADMIN) ================= */
export const addLecture = TryCatch(async (req, res) => {
  console.log("=== Add Lecture Route ===");
  console.log("Body:", req.body);
  console.log("File:", req.file); // Check if multer parsed the file
  console.log("Params:", req.params);

  if (!req.file) {
    console.error("No file uploaded!");
    return res.status(400).json({ message: "No file uploaded" });
  }

  const courseId = req.params.id;

  let videoKey;
  try {
    videoKey = await uploadToSupabase("lectures", req.file);
    console.log("Supabase upload success:", videoKey);
  } catch (err) {
    console.error("Supabase upload failed:", err);
    return res.status(500).json({ message: "Supabase upload failed", error: err.message });
  }

  let lecture;
  try {
    lecture = await Lecture.create({
      title: req.body.title,
      description: req.body.description,
      course: courseId,
      video: videoKey,
    });
    console.log("Lecture created in DB:", lecture._id);
  } catch (err) {
    console.error("DB error creating lecture:", err);
    return res.status(500).json({ message: "Database error", error: err.message });
  }

  res.status(201).json({ message: "Lecture added", lecture });
});

/* ================= MY COURSES ================= */

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Course.find({ _id: req.user.subscription });
  res.json({ courses });
});

/* ================= PAYMENTS ================= */

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const course = await Course.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({ message: "Already subscribed" });
  }

  const order = await rzp.orders.create({
    amount: Number(course.price * 100),
    currency: "INR",
  });

  res.json({ order, course });
});

export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const user = await User.findById(req.user._id);
  const course = await Course.findById(req.params.id);

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment failed" });
  }

  await Payment.create(req.body);
  user.subscription.push(course._id);

  await Progress.create({
    course: course._id,
    user: user._id,
    completedLectures: [],
  });

  await user.save();

  res.json({ message: "Payment successful" });
});

/* ================= PROGRESS ================= */

export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  const { lectureId } = req.query;

  if (!progress.completedLectures.includes(lectureId)) {
    progress.completedLectures.push(lectureId);
    await progress.save();
  }

  res.json({ message: "Progress updated" });
});

export const getProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) return res.status(404).json({ message: "null" });

  const allLectures = await Lecture.countDocuments({ course: req.query.course });
  const completed = progress.completedLectures.length;

  res.json({
    courseProgressPercentage: (completed * 100) / allLectures,
    completed,
    allLectures,
    progress,
  });
});
