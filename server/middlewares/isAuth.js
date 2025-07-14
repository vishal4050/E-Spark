import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({ message: "Please login" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedData._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (error) {
    return res.status(500).json({ message: "Login first", error: error.message });
  }
};


export const isAdmin = (req, res, next) => {
 try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, admin only" });
    }
    next();
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
 }
}