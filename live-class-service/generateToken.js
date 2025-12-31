import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Payload for the user you want to generate a token for
const payload = {
  id: "user1",           // unique user id
  role: "instructor",    // or "student"
  name: "Vishal"
};

// Sign the token with your secret
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: "1h"  // token validity
});

console.log("🎯 Generated JWT Token:");
console.log(token);
