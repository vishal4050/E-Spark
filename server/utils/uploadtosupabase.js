// utils/uploadToSupabase.js
import { getSupabase } from "../database/supabase.js";
import { v4 as uuid } from "uuid";

export const uploadToSupabase = async (bucket, file) => {
  if (!file || !file.buffer) {
    throw new Error("No file buffer found. Make sure multer uses memoryStorage.");
  }

  const ext = file.originalname.split(".").pop();
  const fileName = `${uuid()}.${ext}`;

  const { error } = await getSupabase()
    .storage
    .from(bucket)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false, // fail if file exists
    });

  if (error) throw error;

  return fileName; // store this key in DB
};
