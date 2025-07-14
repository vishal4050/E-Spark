import express from "express";
import { register } from "../controllers/user.js";
import { verifyUser } from "../controllers/user.js";
import { login } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
import { profile } from "../controllers/user.js";
const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser);
router.post("/user/login", login);
router.get("/user/me", isAuth, profile);
export default router;