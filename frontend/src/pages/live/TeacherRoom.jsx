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

      try {
        /* ===============================
           1️⃣ SCREEN CAPTURE (VIDEO ONLY)
        =============================== */
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            frameRate: 30,
            cursor: "always",
          },
          audio: false,
        });

        /* ===============================
           2️⃣ MICROPHONE CAPTURE
        =============================== */
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        const videoTrack = screenStream.getVideoTracks()[0];
        const audioTrack = micStream.getAudioTracks()[0];

        if (!videoTrack) {
          alert("Screen video track missing");
          return;
        }

        if (!audioTrack) {
          alert("Microphone audio track missing");
          return;
        }

        /* ===============================
           3️⃣ COMBINE STREAM (SAFE)
        =============================== */
        const combinedStream = new MediaStream();
        combinedStream.addTrack(videoTrack);
        combinedStream.addTrack(audioTrack);

        streamRef.current = combinedStream;

        console.log("🎧 Tracks:", {
          audio: combinedStream.getAudioTracks().length,
          video: combinedStream.getVideoTracks().length,
        });

        /* ===============================
           4️⃣ PREVIEW (AFTER TRACKS)
        =============================== */
        if (videoRef.current) {
          videoRef.current.srcObject = combinedStream;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;

          await videoRef.current.play();
        }

        socket.emit("teacher-ready", { classId });
      } catch (err) {
        console.error("MEDIA ERROR:", err);
        alert("Media permission error");
      }
    });

    /* ===============================
       STUDENT JOIN → WEBRTC
    =============================== */
    socket.on("student-joined", async ({ studentSocketId }) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peersRef.current[studentSocketId] = pc;

      // ADD TRACKS (CRITICAL)
      streamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, streamRef.current);
      });

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

  /* 🔴 RECORDING (VIDEO + AUDIO) */
  const toggleRecording = () => {
    if (!isRecording) {
      const recorder = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      recorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => e.data.size && recordedChunksRef.current.push(e.data);
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

      <video ref={videoRef} className="teacher-video" autoPlay />

      <div className="controls">
        <button onClick={() => videoRef.current?.requestFullscreen()}>
          ⛶ Full Screen
        </button>

        <button onClick={toggleRecording} className={isRecording ? "rec" : ""}>
          {isRecording ? "⏹ Stop Recording" : "⏺ Start Recording"}
        </button>
      </div>
    </div>
  );
};

export default TeacherRoom;
