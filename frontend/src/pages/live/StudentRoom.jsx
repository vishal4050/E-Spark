import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { connectSocket } from "../../socket/socket";
import "./studentroom.css";

const StudentRoom = () => {
  const { classId } = useParams();
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true);

  // 🔊 Enable audio (AUTOPLAY FIX)
  const enableAudio = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    videoRef.current.volume = 1;
    videoRef.current.play();
    setIsMuted(false);
    console.log("🔊 Audio enabled by user");
  };

  // 🔇 Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const muted = !videoRef.current.muted;
    videoRef.current.muted = muted;
    setIsMuted(muted);
  };

  // ⛶ Fullscreen (mobile safe)
  const handleFullScreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    socket.emit("join-class", { classId });

    socket.on("webrtc-offer", async ({ offer, teacherSocketId }) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      pc.ontrack = (event) => {
        const stream = event.streams[0];

        console.log("🎧 Received tracks:", {
          audio: stream.getAudioTracks().length,
          video: stream.getVideoTracks().length,
        });

        videoRef.current.srcObject = stream;
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc-ice", {
            targetSocketId: teacherSocketId,
            candidate: event.candidate,
          });
        }
      };

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", { teacherSocketId, answer });
    });

    socket.on("webrtc-ice", ({ candidate }) => {
      if (candidate) {
        pcRef.current?.addIceCandidate(candidate).catch(console.error);
      }
    });

    return () => {
      socket.off("webrtc-offer");
      socket.off("webrtc-ice");
      pcRef.current?.close();
    };
  }, [classId]);

  return (
    <div className="student-room">
      <div className="student-room__video-wrapper">
        <div className="student-room__live-indicator">
          <span className="live-dot"></span> LIVE
        </div>

        {/* 🎥 VIDEO */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="student-room__video"
        />

        {/* 🔊 AUDIO ENABLE OVERLAY */}
        {isMuted && (
          <div className="audio-overlay">
            <button className="enable-audio-btn" onClick={enableAudio}>
              🔊 Tap to Enable Audio
            </button>
          </div>
        )}

        {/* 🎛 CONTROLS */}
        <div className="student-room__controls-full">
          <button className="control-btn" onClick={toggleMute}>
            {isMuted ? "🔇 Muted" : "🔊 Sound"}
          </button>

          <button className="control-btn" onClick={handleFullScreen}>
            ⛶ Full Screen
          </button>

          <button className="control-btn leave-btn">
            🚪 Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentRoom;
