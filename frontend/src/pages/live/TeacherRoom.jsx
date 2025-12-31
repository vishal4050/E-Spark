import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { connectSocket } from "../../socket/socket";

const TeacherRoom = () => {
  const { classId } = useParams();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const peersRef = useRef({});

  useEffect(() => {
    const socket = connectSocket();

    socket.on("connect", async () => {
      console.log("👨‍🏫 Teacher connected:", socket.id);

      // 1️⃣ Create / reattach room
      socket.emit("start-class", { classId });

      // 2️⃣ Start screen share
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      await videoRef.current.play();

      console.log("🖥️ Screen sharing started");

      // 3️⃣ VERY IMPORTANT: notify backend
      socket.emit("teacher-ready", { classId });
    });

    // 🔔 Student joined
    socket.on("student-joined", async ({ studentSocketId }) => {
      console.log("👨‍🎓 Student joined:", studentSocketId);

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
      console.log("📤 Offer sent to:", studentSocketId);
    });

    socket.on("webrtc-answer", async ({ studentSocketId, answer }) => {
      console.log("📥 Answer from:", studentSocketId);
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

  return (
    <div>
      <h2>Teacher Screen</h2>
      <video ref={videoRef} autoPlay muted playsInline />
    </div>
  );
};

export default TeacherRoom;
