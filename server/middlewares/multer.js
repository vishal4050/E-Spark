import multer from "multer";

/**
 * Supabase requires file buffer
 * so we must use memoryStorage
 */
export const uploadFiles = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
});
