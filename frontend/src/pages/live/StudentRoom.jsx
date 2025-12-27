import React from "react";
import "./LiveClasses.css";

const StudentRoom = () => {
  return (
    <div className="student-room-container">
      <h1 className="page-title">Live Class (Student View)</h1>

      <div className="video-container">
        <video className="video-player" controls />
      </div>

      <div className="chat-box">
        <h2 className="chat-title">Live Chat</h2>

        <div className="chat-messages"></div>

        <input
          className="chat-input"
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default StudentRoom;
