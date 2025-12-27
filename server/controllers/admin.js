import TryCatch from "../middlewares/TryCatch.js";
import { Course } from "../models/Course.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/user.js";
import fs from "fs";
import { promisify } from "util";
import { uploadToSupabase } from "../utils/uploadtosupabase.js";
import { deleteFromSupabase } from "../utils/deleteFromSupabase.js";
const unlinkAsync = promisify(fs.unlink);

/* ================= CREATE COURSE ================= */
export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Course image is required" });
  }

  // 🔥 Upload to Supabase
  const imageKey = await uploadToSupabase("course-images", req.file);

  await Course.create({
    title,
    description,
    category,
    createdBy,
    image: imageKey, // ✅ Supabase key
    duration,
    price,
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
  });
});

/* ================= DELETE LECTURE ================= */
export const deleteLecture = TryCatch(async (req, res) => {
  const { permanent } = req.query;

  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  // 🔥 PERMANENT DELETE
  if (permanent === "true") {
    if (lecture.video) {
      await deleteFromSupabase("lectures", lecture.video);
    }
  }

  await lecture.deleteOne();

  res.json({
    message:
      permanent === "true"
        ? "Lecture permanently deleted"
        : "Lecture unlinked (file kept)",
  });
});

/* ================= DELETE COURSE ================= */
export const deleteCourse = TryCatch(async (req, res) => {
  const { permanent } = req.query; // ?permanent=true

  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const lectures = await Lecture.find({ course: course._id });

  // 🔥 PERMANENT DELETE FROM SUPABASE
  if (permanent === "true") {
    // Delete course image
    if (course.image) {
      await deleteFromSupabase("course-images", course.image);
    }

    // Delete all lecture videos
    await Promise.all(
      lectures.map(async (lecture) => {
        if (lecture.video) {
          await deleteFromSupabase("lectures", lecture.video);
        }
      })
    );
  }

  // ❌ Delete DB records
  await Lecture.deleteMany({ course: course._id });
  await course.deleteOne();

  // ❌ Remove course from all user subscriptions
  await User.updateMany({}, { $pull: { subscription: course._id } });

  res.json({
    success: true,
    message:
      permanent === "true"
        ? "Course permanently deleted (media removed)"
        : "Course deleted (media preserved)",
  });
});

/* ================= STATS ================= */
export const getAllStats = TryCatch(async (req, res) => {
  const totalCourses = await Course.countDocuments();
  const totalLectures = await Lecture.countDocuments();
  const totalUsers = await User.countDocuments();

  res.json({
    totalCourses,
    totalLectures,
    totalUsers,
  });
});

/* ================= USERS ================= */
export const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");

  res.status(200).json({
    success: true,
    users,
  });
});

/* ================= UPDATE ROLE ================= */
export const updateRole = TryCatch(async (req, res) => {
  if (req.user.mainrole !== "superadmin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const user = await User.findById(req.params.id);

  user.role = user.role === "user" ? "admin" : "user";
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.name} role updated to ${user.role}`,
  });
});
