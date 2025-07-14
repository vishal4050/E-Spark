import express from "express";
import { createCourse } from "../controllers/admin.js";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { uploadfile } from "../middlewares/multer.js"; // 
import { addLecture } from "../controllers/admin.js";
import { deleteLecture } from "../controllers/admin.js";
import { deleteCourse } from "../controllers/admin.js";
import { getAllStats } from "../controllers/admin.js";
const router = express.Router();

router.post("/course/new",isAuth,isAdmin,uploadfile, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadfile, addLecture);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.get("/stats/all", isAuth, isAdmin, getAllStats);
export default router;