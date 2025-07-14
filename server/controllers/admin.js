import TryCatch from "../middlewares/TryCatch.js";
import { Course } from "../models/Course.js";
import { Lecture } from "../models/Lecture.js";
import fs from "fs";
import {rm} from "fs";
import { promisify } from "util";
import { User } from "../models/User.js";
export const createCourse = TryCatch(async (req, res) => {
    const { title, description, category,createdBy,duration,price } = req.body;
const image= req.file ;
await Course.create({
        title,
        description,
        category,
        createdBy,
        image: image?.path, 
        duration,
        price,
});
    res.status(201).json({ message: "Course created successfully"});
});

export const addLecture = TryCatch(async (req, res) => {
    const course= await Course.findById(req.params.id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    const { title, description } = req.body;
    const file= req.file;
    
    const lecture =await Lecture.create({
        title,
        description,
        video: file?.path,
        course: course._id,
        });
    res.status(201).json({ message: "Lecture added successfully", lecture });
});

export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
        return res.status(404).json({ message: "Lecture not found" });
    }
 rm(lecture.video, () => {
console.log("Lecture video deleted successfully");
 });

    await lecture.deleteOne();
    res.status(200).json({ message: "Lecture deleted successfully" });
});

const unlikeAsync=promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
    const course = await Course.findById(req.params.id);
    const lectures = await Lecture.find({ course: course._id });
await Promise.all(
lectures.map(async (lecture) => {
await unlikeAsync(lecture.video);
    console.log("Lecture video deleted successfully");
})
);
rm(course.image, () => {
    console.log("Course image deleted successfully");
});
    await Lecture.find({ course: req.params.id }).deleteMany();
    await course.deleteOne();
    await User.updateMany(
        {},
        { $pull: {subscription: req.params.id } }
    );
    res.json({ message: "Course deleted successfully" });
});

export const getAllStats = TryCatch(async (req, res) => {
    const totalCourses = await Course.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalUsers = await User.countDocuments();
    res.json({
        totalCourses,
        totalLectures,
        totalUsers,
    });
});