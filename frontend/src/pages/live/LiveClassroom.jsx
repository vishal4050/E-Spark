import React from "react";
import { useNavigate } from "react-router-dom";
import "./LiveClasses.css";

const LiveClasses = () => {
  const navigate = useNavigate();

  const handleJoinAsStudent = (classId) => {
    navigate(`/live/student/${classId}`);
  };

  const handleJoinAsTeacher = (classId) => {
    navigate(`/live/teacher/${classId}`);
  };

  return (
    <div className="live-classes-container">
      <h1 className="live-title">🎥 Live Classroom</h1>

      <div className="classes-card">
        <h2 className="classes-heading">Available Classes</h2>

        {[1, 2, 3].map((id) => (
          <div key={id} className="class-item">
            <p className="class-name">Class #{id} – Mathematics</p>

            <div className="class-actions">
              <button
                onClick={() => handleJoinAsStudent(id)}
                className="join-student-btn"
              >
                Join as Student
              </button>

              <button
                onClick={() => handleJoinAsTeacher(id)}
                className="join-teacher-btn"
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
