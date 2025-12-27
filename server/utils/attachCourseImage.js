import { getSupabase } from "../database/supabase.js";

/**
 * Attach public image URL to a single course document
 */
export const attachCourseImage = (course) => {
  if (!course || !course.image) return course;

  const supabase = getSupabase();

  const { data } = supabase.storage
    .from("course-images")
    .getPublicUrl(course.image);

  return {
    ...course._doc,
    image: data.publicUrl,
  };
};

/**
 * Attach public image URLs to multiple courses
 */
export const attachCourseImages = (courses = []) => {
  return courses.map(course => attachCourseImage(course));
};
