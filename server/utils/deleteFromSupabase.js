import { getSupabase } from "../database/supabase.js";

export const deleteFromSupabase = async (bucket, filePath) => {
  const supabase = getSupabase();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw new Error(error.message);
  }
};
