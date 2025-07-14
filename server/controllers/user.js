import {User} from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";
export const register = TryCatch (async(req, res,next) => {
    const { name, email, password } = req.body;
     let user = await User.findOne({ email});
     if(user) return res.status(400).json({
         message:"user already exists",
     });
     const hashpassword = await bcrypt.hash(password, 10);
  user= ({
         name,
         email,
         password:hashpassword,
     });
   const otp=Math.floor(Math.random() * 1000000);
   const activationToken = jwt.sign({ 
     user,
     otp,
   }, process.env.JWT_SECRET, { expiresIn: "5m" });
     // Logic for registering a user
   
   const data={
     name,
     otp,
 };
  await sendMail(
   email, 
   "E learning", 
   data);
   
     res.status(200).json({message: "User registered successfully, please check your email for OTP verification",
       activationToken,
     });
    });


export const verifyUser = TryCatch(async (req, res) => {
const { activationToken, otp } = req.body;
const verify= jwt.verify(activationToken, process.env.JWT_SECRET);
if(!verify) {
    return res.status(400).json({ message: "OTP expired" });
}
if(verify.otp !== otp) {
    return res.status(400).json({ message: "Incorrect OTP" });
}
await User.create({
  name: verify.user.name,
  email: verify.user.email,
  password: verify.user.password,
});
res.status(200).json({ message: "User Registered successfully" });
})

export const login = TryCatch(async (req, res) => {
const { email, password } = req.body;
const user=await User.findOne({ email});
if(!user) return res.status(400).json({
    message: "No User does with this email",
})
const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch) return res.status(400).json({
    message: "Incorrect Password",})
const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "15d" });
res.json({
    message:`Welcome back ${user.name}`,
    token,
    user,
})
})

export const profile = TryCatch(async (req, res) => {
const user = await User.findById(req.user._id);
res.json({ user});
});