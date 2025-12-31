import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { connectSocket } from "../../socket/socket";
import "./studentroom.css";

const StudentRoom = () => {
  const { classId } = useParams();
  const videoRef = useRef(null);
  const pcRef = useRef(null);

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) { /* Safari */
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) { /* IE11 */
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    const socket = connectSocket();

    socket.emit("join-class", { classId });

    socket.on("webrtc-offer", async ({ offer, teacherSocketId }) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      pc.ontrack = (e) => {
        videoRef.current.srcObject = e.streams[0];
        videoRef.current.play().catch((err) => console.error("Video play error:", err));
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("webrtc-ice", {
            targetSocketId: teacherSocketId,
            candidate: e.candidate,
          });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", { teacherSocketId, answer });
    });

    socket.on("webrtc-ice", ({ candidate }) => {
      if (candidate) {
        pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
      }
    });
  }, [classId]);

  return (
    <div className="student-room">
      <div className="student-room__video-wrapper">
        <div className="student-room__live-indicator">
          <span className="live-dot"></span> LIVE
        </div>
        <video ref={videoRef} autoPlay playsInline muted className="student-room__video" />

        {/* Full-width controls */}
        <div className="student-room__controls-full">
          <div className="controls-left">
            <button className="control-btn">🔇 Mute</button>
            <button className="control-btn">📷 Video</button>
            <button className="control-btn">⏸️ Pause</button>
            <button className="control-btn">⚙️ Settings</button>
            <button className="control-btn" onClick={handleFullScreen}>⛶ Full Screen</button>
          </div>
          <div className="controls-right">
            <button className="control-btn leave-btn">🚪 Leave Class</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRoom;
