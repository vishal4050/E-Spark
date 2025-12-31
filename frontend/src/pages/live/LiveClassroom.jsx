import React from "react";
import { useNavigate } from "react-router-dom";
import "./LiveClasses.css";

const classes = [
  { id: "1", subject: "Mathematics" },
  { id: "2", subject: "Physics" },
  { id: "3", subject: "Chemistry" },
];

const LiveClasses = () => {
  const navigate = useNavigate();

  return (
    <div className="live-classes-container">
      <h1 className="live-title">🎥 Live Classroom</h1>

      <div className="classes-card">
        <h2 className="classes-heading">Available Classes</h2>

        {classes.map((cls) => (
          <div key={cls.id} className="class-item">
            <p className="class-name">
              Class #{cls.id} – {cls.subject}
            </p>

            <div className="class-actions">
              <button
                className="join-student-btn"
                onClick={() => {
                  console.log("Joining as Student, classId:", cls.id);
                  navigate(`/live/student/${cls.id}`);
                }}
              >
                Join as Student
              </button>

              <button
                className="join-teacher-btn"
                onClick={() => {
                  console.log("Joining as Teacher, classId:", cls.id);
                  navigate(`/live/teacher/${cls.id}`);
                }}
              >
                Join as Teacher
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveClasses;
