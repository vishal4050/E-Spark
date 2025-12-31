import {User} from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";
import nodemailer from 'nodemailer';
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
const token = jwt.sign(
  { 
    _id: user._id,
    role: user.role,       // include role
    mainrole: user.mainrole // optional if needed
  }, 
  process.env.JWT_SECRET, 
  { expiresIn: "15d" }
);

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

export const forgotPassword=TryCatch(async(req,res)=>{
  const {email}=req.body;
  const user=await User.findOne({email});
  if(!user) return res.status(400).json({message: "No User does with this email"});
  const token=jwt.sign({email},process.env.FORGOT_PASSWORD);
  const data={email,token};
  await sendForgotMail("EduSpark",data);
  user.resetPasswordExpire=Date.now()+5*60*1000;
  await user.save();
  res.json({message:"Reset Password link sent to your email"});
})

export const resetPassword=TryCatch(async(req,res)=>{
  const decodedData=jwt.verify(req.query.token,process.env.FORGOT_PASSWORD);
  const user=await User.findOne({email:decodedData.email});
  if(!user) return res.status(404).json({message: "No User with this email"});
  if(user.resetPasswordExpire===null) return res.status(400).json({
    message: "Password reset link has expired"
  })
  if(user.resetPasswordExpire<Date.now()){
    return res.status(400).json({
      message: "Password reset link has expired"
    })
  }
  const password=await bcrypt.hash(req.body.password,10);
  user.password=password;
  user.resetPasswordExpire=null;
  await user.save();
  res.json({
    message: "Password reset successfully",
  })
})