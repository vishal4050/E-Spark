import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { connectSocket } from "../../socket/socket";

const StudentRoom = () => {
  const { classId } = useParams();
  const videoRef = useRef(null);
  const pcRef = useRef(null);

  useEffect(() => {
    const socket = connectSocket();

    socket.emit("join-class", { classId });

    socket.on("webrtc-offer", async ({ offer, teacherSocketId }) => {
      console.log("📥 Offer received");

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

  return <video ref={videoRef} autoPlay playsInline muted className="student-video" />;
};

export default StudentRoom;
