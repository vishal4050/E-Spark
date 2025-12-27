import React, { useRef } from "react";
import "./LiveClasses.css";

const TeacherRoom = () => {
  const videoRef = useRef();

  return (
    <div className="teacher-room-container">
      <h1 className="teacher-title">Teacher Live Stream</h1>

      <div className="teacher-video-container">
        <video ref={videoRef} autoPlay muted className="teacher-video-player" />
      </div>

      <div className="teacher-controls">
        <button className="start-stream-btn">Start Streaming</button>
      </div>
    </div>
  );
};

export default TeacherRoom;
