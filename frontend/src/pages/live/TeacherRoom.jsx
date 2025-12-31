import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { connectSocket } from "../../socket/socket";
import "./teacherroom.css";

const TeacherRoom = () => {
  const { classId } = useParams();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const peersRef = useRef({});
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const socket = connectSocket();

    socket.on("connect", async () => {
      socket.emit("start-class", { classId });

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      await videoRef.current.play();

      socket.emit("teacher-ready", { classId });
    });

    socket.on("student-joined", async ({ studentSocketId }) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peersRef.current[studentSocketId] = pc;

      streamRef.current.getTracks().forEach((track) =>
        pc.addTrack(track, streamRef.current)
      );

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("webrtc-ice", {
            targetSocketId: studentSocketId,
            candidate: e.candidate,
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc-offer", { studentSocketId, offer });
    });

    socket.on("webrtc-answer", async ({ studentSocketId, answer }) => {
      await peersRef.current[studentSocketId]?.setRemoteDescription(answer);
    });

    socket.on("webrtc-ice", ({ candidate, from }) => {
      peersRef.current[from]?.addIceCandidate(candidate);
    });

    return () => {
      Object.values(peersRef.current).forEach((pc) => pc.close());
      peersRef.current = {};
    };
  }, [classId]);

  /* 🎥 Fullscreen */
  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video.requestFullscreen) video.requestFullscreen();
  };

  /* 🔴 Recording */
  const toggleRecording = () => {
    if (!isRecording) {
      const recorder = new MediaRecorder(streamRef.current);
      recorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => recordedChunksRef.current.push(e.data);
      recorder.onstop = downloadRecording;

      recorder.start();
      setIsRecording(true);
    } else {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `class-${classId}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="teacher-room">
      <div className="live-indicator">
        <span className="dot" /> LIVE
      </div>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="teacher-video"
          playsInline
        />
      </div>

      <div className="controls">
        <button onClick={handleFullscreen}>⛶ Full Screen</button>
        <button onClick={toggleRecording} className={isRecording ? "rec" : ""}>
          {isRecording ? "⏹ Stop Recording" : "⏺ Start Recording"}
        </button>
      </div>
    </div>
  );
};

export default TeacherRoom;
