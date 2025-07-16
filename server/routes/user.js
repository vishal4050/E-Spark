import express from "express";
import { forgotPassword, register, resetPassword } from "../controllers/user.js";
import { verifyUser } from "../controllers/user.js";
import { login } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
import { profile } from "../controllers/user.js";
import { addProgress, getProgress } from "../controllers/courses.js";
const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser);
router.post("/user/login", login);
router.get("/user/me", isAuth, profile);
router.post("/user/forgot",forgotPassword);
router.post("/user/reset",resetPassword);
router.post("/user/progress",isAuth,addProgress);
router.get("/user/progress",isAuth,getProgress);
export default router;