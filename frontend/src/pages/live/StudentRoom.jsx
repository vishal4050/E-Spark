import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectSocket } from "../../socket/socket";
import toast, { Toaster } from "react-hot-toast";
import "./studentroom.css";

const StudentRoom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);

  // States
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isConnected, setIsConnected] = useState(false);

  // 🔊 Enable Audio (Unlock Autoplay)
  const enableAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume;
      videoRef.current.play().catch((e) => console.error(e));
      setIsMuted(false);
      toast.success("Audio Enabled 🔊");
    }
  };

  // 🎚 Handle Volume
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // ⛶ Full Screen
  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  // 🚪 Leave Class
  const leaveClass = () => {
    socketRef.current?.emit("leave-class", { classId });
    if (pcRef.current) pcRef.current.close();
    socketRef.current?.disconnect();
    toast("Left Class", { icon: "👋" });
    navigate("/");
  };

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-class", { classId });
    });

    socket.on("webrtc-offer", async ({ offer, teacherSocketId }) => {
      // Hide loader immediately
      setIsConnected(true);

      if (pcRef.current) pcRef.current.close();

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          setIsConnected(true);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("webrtc-ice", {
            targetSocketId: teacherSocketId,
            candidate: event.candidate,
          });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", { teacherSocketId, answer });
    });

    socket.on("webrtc-ice", ({ candidate }) => {
      pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("class-ended", () => {
      toast.error("Class Ended");
      setTimeout(leaveClass, 2000);
    });

    return () => {
      socket.disconnect();
      pcRef.current?.close();
    };
  }, [classId]);

  return (
    <div className="student-room">
      <Toaster position="top-center" />

      {/* VIDEO CONTAINER */}
      <div className="student-video-wrapper">

        {/* LOADER */}
        {!isConnected && (
          <div className="loading-page">
            <div className="loader"></div>
            <div className="loader-text">Waiting for Teacher...</div>
          </div>
        )}

        {/* LIVE TAG */}
        {isConnected && (
          <div className="live-tag">
            <div className="live-dot"></div>
            LIVE
          </div>
        )}

        {/* TAP TO UNMUTE */}
        {isConnected && isMuted && (
          <div className="tap-to-unmute">
            <button onClick={enableAudio}>🔊 TAP TO UNMUTE</button>
          </div>
        )}

        {/* VIDEO PLAYER */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={true} // Important: Start muted for autoplay
          className="main-video"
        />

        {/* CONTROLS BAR */}
        <div className="controls-bar">
          <div className="left-controls">
            <span className="vol-icon">{volume === 0 ? "🔇" : "🔊"}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>

          <div className="right-controls">
            <button className="icon-btn" onClick={toggleFullScreen} title="Full Screen">
              ⛶
            </button>
            <button className="leave-btn" onClick={leaveClass}>
              Leave Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRoom;
