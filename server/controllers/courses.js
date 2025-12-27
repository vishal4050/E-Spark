import { Course } from "../models/Course.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/user.js";
import { rzp } from "../index.js";
import { Payment } from "../models/payments.js";
import crypto from "crypto";
import { Progress } from "../models/Progress.js";

import { uploadToSupabase } from "../utils/uploadtosupabase.js";
import { getSupabase } from "../database/supabase.js";
import {
  attachCourseImage,
  attachCourseImages,
} from "../utils/attachCourseImage.js";

/* ================= COURSES ================= */

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Course.find();
  res.json({ courses: attachCourseImages(courses) });
});

export const getCourseDetails = TryCatch(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  res.json({ course: attachCourseImage(course) });
});

/* ================= LECTURES ================= */

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });
  const user = await User.findById(req.user._id);

  if (user.role === "admin") return res.json({ lectures });

  if (!user.subscription.includes(req.params.id)) {
    return res
      .status(400)
      .json({ message: "You have not subscribed to this course" });
  }

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  const user = await User.findById(req.user._id);
  if (
    user.role !== "admin" &&
    !user.subscription.includes(lecture.course.toString())
  ) {
    return res
      .status(403)
      .json({ message: "You have not subscribed to this course" });
  }

  let videoUrl = lecture.video;

  // Generate signed URL for Supabase video
  if (!videoUrl.startsWith("http")) {
    const { data, error } = await getSupabase().storage
      .from("lectures")
      .createSignedUrl(videoUrl, 60 * 60);

    if (!error) {
      videoUrl = data.signedUrl;
    }
  }

  res.json({
    lecture: {
      ...lecture._doc,
      video: videoUrl,
    },
  });
});

/* ================= ADD LECTURE (ADMIN) ================= */

export const addLecture = TryCatch(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const videoKey = await uploadToSupabase("lectures", req.file);

  const lecture = await Lecture.create({
    title: req.body.title,
    description: req.body.description,
    course: req.params.id,
    video: videoKey,
  });

  res.status(201).json({
    success: true,
    message: "Lecture added",
    lecture,
  });
});

/* ================= MY COURSES ================= */

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Course.find({ _id: req.user.subscription });
  res.json({ courses: attachCourseImages(courses) });
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

  res.json({
    order,
    course: attachCourseImage(course),
  });
});

export const paymentVerification = TryCatch(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

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
  await user.save();

  await Progress.create({
    course: course._id,
    user: user._id,
    completedLectures: [],
  });

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

  const allLectures = await Lecture.countDocuments({
    course: req.query.course,
  });

  const completed = progress.completedLectures.length;

  res.json({
    courseProgressPercentage: (completed * 100) / allLectures,
    completed,
    allLectures,
    progress,
  });
});
