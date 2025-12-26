import express from "express";
import { createCourse, getAllUsers, updateRole } from "../controllers/admin.js";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { uploadFiles } from "../middlewares/multer.js"; // 
import { addLecture } from "../controllers/admin.js";
import { deleteLecture } from "../controllers/admin.js";
import { deleteCourse } from "../controllers/admin.js";
import { getAllStats } from "../controllers/admin.js";
const router = express.Router();

router.post("/course/new",isAuth,isAdmin,uploadFiles.single("image"), createCourse);
// router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLecture);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.get("/stats/all", isAuth, isAdmin, getAllStats);
router.put("/user/:id",isAuth,updateRole);
router.get("/users",isAuth,isAdmin,getAllUsers);
export default router;