import React from "react";
import "./coursecard.css";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CourseData } from "../../context/CourseContext";

const server = "http://localhost:5000";

const CourseCard = ({ course }) => {
  const { user, isAuth } = UserData();
  const navigate = useNavigate();
  const { fetchCourses } = CourseData();

  const DeleteHandler = async (id) => {
    // 1️⃣ First confirmation
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    // 2️⃣ Permanent or unlink
    const permanent = window.confirm(
      "Do you want to permanently delete this course?\n\nOK = Permanent delete (files removed)\nCancel = Just unlink (files kept)"
    );

    try {
      const { data } = await axios.delete(
        `${server}/api/course/${id}?permanent=${permanent}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="course-card">
      <img src={course.image} alt="" className="course-image" />

      <h3>{course.title}</h3>
      <p>Instructor - {course.createdBy}</p>
      <p>Duration - {course.duration} weeks</p>
      <p>Price - ₹ {course.price}</p>

      {/* USER ACTION BUTTONS */}
      {isAuth ? (
        <>
          {user && user.role !== "admin" ? (
            <>
              {user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="common-btn"
                >
                  Get Started
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="common-btn"
            >
              Study
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}

      <br />

      {/* ADMIN DELETE */}
      {user && user.role === "admin" && (
        <button
          className="common-btn"
          style={{ background: "red", marginTop: "5px" }}
          onClick={() => DeleteHandler(course._id)}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default CourseCard;
