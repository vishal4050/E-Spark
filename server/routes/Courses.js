import express from "express";
import { getAllCourses } from "../controllers/courses.js";
import { getCourseDetails as getSingleCourse } from "../controllers/courses.js";
import { fetchLecture } from "../controllers/courses.js";
import { fetchLectures } from "../controllers/courses.js";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { getMyCourses } from "../controllers/courses.js";
import { checkout } from "../controllers/courses.js";
import { paymentVerification } from "../controllers/courses.js";
import { uploadFiles } from "../middlewares/multer.js";
import { addLecture } from "../controllers/courses.js";
import multer from "multer";
const router = express.Router();
router.get("/course/all",getAllCourses);
router.get("/course/:id", getSingleCourse);
router.get("/lectures/:id",isAuth, fetchLectures);
router.get("/lecture/:id",isAuth, fetchLecture);
router.get("/mycourses", isAuth, getMyCourses);
router.post("/course/checkout/:id", isAuth, checkout);
router.post("/verification/:id", isAuth, paymentVerification);
router.post(
  "/course/:id/lecture",
  isAuth,
  isAdmin,
  uploadFiles.single("file"),
  addLecture
);

export default router;