import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectSocket } from "../../socket/socket";
import toast, { Toaster } from 'react-hot-toast'; // Run: npm install react-hot-toast
import "./teacherroom.css";

const TeacherRoom = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const peersRef = useRef({});
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // 1. Setup Socket & Create Room Immediately
  useEffect(() => {
    const s = connectSocket();
    setSocket(s);

    s.on("connect", () => {
      // ✅ FIX: Create room immediately so students can join the "Lobby"
      // while waiting for you to go live.
      s.emit("start-class", { classId });
    });

    s.on("student-joined", async ({ studentSocketId }) => {
      // If we aren't live yet, ignore this. 
      // The backend will resend this event when we emit 'teacher-ready' later.
      if (!streamRef.current) return; 

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peersRef.current[studentSocketId] = pc;
      streamRef.current.getTracks().forEach((track) => pc.addTrack(track, streamRef.current));

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          s.emit("webrtc-ice", { targetSocketId: studentSocketId, candidate: e.candidate });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      s.emit("webrtc-offer", { studentSocketId, offer });
    });

    s.on("webrtc-answer", async ({ studentSocketId, answer }) => {
      await peersRef.current[studentSocketId]?.setRemoteDescription(answer);
    });

    s.on("webrtc-ice", ({ candidate, from }) => {
      peersRef.current[from]?.addIceCandidate(candidate);
    });

    // Prevent accidental refresh
    const blockReload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", blockReload);

    return () => {
      window.removeEventListener("beforeunload", blockReload);
      cleanupAndExit(false);
    };
  }, [classId]);

  // 2. Go Live (Manual Trigger)
  const startLive = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30, cursor: "always" },
        audio: false,
      });

      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const combinedStream = new MediaStream([
        screenStream.getVideoTracks()[0],
        micStream.getAudioTracks()[0],
      ]);

      streamRef.current = combinedStream;
      videoRef.current.srcObject = combinedStream;
      videoRef.current.muted = true; // Local mute to prevent echo

      // ✅ Now that we have the stream, tell backend we are ready.
      // The backend will now resend all "student-joined" events.
      socket.emit("teacher-ready", { classId });
      
      setIsLive(true);
      toast.success("You are now LIVE!");

      // Handle stream stop (user clicks "Stop Sharing" in browser UI)
      screenStream.getVideoTracks()[0].onended = () => {
        cleanupAndExit(true);
      };

    } catch (err) {
      console.error("Error starting live:", err);
      toast.error("Failed to start. Check permissions.");
    }
  };

  /* ===============================
     AUDIO TOGGLE
  =============================== */
  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        toast(audioTrack.enabled ? "Microphone On 🎤" : "Microphone Muted 🔇");
      }
    }
  };

  /* ===============================
     RECORDING (Restored)
  =============================== */
  const toggleRecording = () => {
    if (!isRecording) {
      recorderRef.current = new MediaRecorder(streamRef.current);
      recordedChunksRef.current = [];

      recorderRef.current.ondataavailable = (e) =>
        e.data.size && recordedChunksRef.current.push(e.data);

      recorderRef.current.onstop = downloadRecording;

      recorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording Started");
    } else {
      recorderRef.current.stop();
      setIsRecording(false);
      toast("Recording Stopped");
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

  /* ===============================
     END CLASS
  =============================== */
  const cleanupAndExit = (navigateAway = true) => {
    socket?.emit("end-class", { classId });

    Object.values(peersRef.current).forEach((pc) => pc.close());
    peersRef.current = {};

    streamRef.current?.getTracks().forEach((t) => t.stop());

    if (navigateAway) {
        toast("Class Ended", { icon: '🛑' });
        setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="teacher-room">
      <Toaster position="top-center" />
      <video ref={videoRef} className="teacher-video" autoPlay playsInline />

      <div className="top-bar">
        {isLive ? <span className="live-badge">🔴 LIVE CLASS</span> : <span>⚪ Standby - Setup your stream</span>}
      </div>

      <div className="control-bar">
        {!isLive ? (
          <button className="go-live-btn" onClick={startLive}>
            🚀 Go Live
          </button>
        ) : (
          <>
             <button onClick={toggleMute} className={isMuted ? "muted" : ""}>
              {isMuted ? "🔇 Unmute" : "🎤 Mute"}
            </button>

            <button onClick={() => videoRef.current?.requestFullscreen()}>
              ⛶ Full Screen
            </button>

            <button
              onClick={toggleRecording}
              className={isRecording ? "rec" : ""}
            >
              {isRecording ? "⏹ Stop Rec" : "⏺ Record"}
            </button>

            <button className="end-btn" onClick={() => cleanupAndExit(true)}>
              ⛔ End Class
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherRoom;