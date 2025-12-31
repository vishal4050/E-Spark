import {
  createRoom,
  getRoom,
  addStudent,
  removeStudent,
  markTeacherReady,
  rooms,
} from "../store/roomStore.js";

export const liveSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ SOCKET CONNECTED:", socket.id);

    // ================= START CLASS =================
    socket.on("start-class", ({ classId }) => {
      let room = getRoom(classId);

      if (!room) {
        createRoom(classId, socket.id);
        console.log("🎥 ROOM CREATED:", classId);
      } else {
        room.instructorSocketId = socket.id;
        console.log("🔄 TEACHER RECONNECTED");
      }

      socket.join(classId);
    });

    // ================= TEACHER READY =================
    socket.on("teacher-ready", ({ classId }) => {
      console.log("👨‍🏫 TEACHER READY:", socket.id);

      markTeacherReady(classId, socket.id);
      const room = getRoom(classId);
      if (!room) return;

      room.students.forEach((studentSocketId) => {
        console.log("📢 Notify teacher about student:", studentSocketId);
        io.to(room.instructorSocketId).emit("student-joined", {
          studentSocketId,
        });
      });
    });

    // ================= STUDENT JOIN =================
    socket.on("join-class", ({ classId }) => {
      const room = getRoom(classId);
      if (!room) return;

      socket.join(classId);
      addStudent(classId, socket.id);

      console.log("👨‍🎓 STUDENT JOINED:", socket.id);

      if (room.teacherReady) {
        io.to(room.instructorSocketId).emit("student-joined", {
          studentSocketId: socket.id,
        });
      }
    });

    // ================= WEBRTC =================
    socket.on("webrtc-offer", ({ studentSocketId, offer }) => {
      console.log("📤 OFFER →", studentSocketId);
      io.to(studentSocketId).emit("webrtc-offer", {
        offer,
        teacherSocketId: socket.id,
      });
    });

    socket.on("webrtc-answer", ({ teacherSocketId, answer }) => {
      console.log("📥 ANSWER →", teacherSocketId);
      io.to(teacherSocketId).emit("webrtc-answer", {
        studentSocketId: socket.id,
        answer,
      });
    });

    socket.on("webrtc-ice", ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit("webrtc-ice", {
        candidate,
        from: socket.id,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ DISCONNECTED:", socket.id);

      for (const [classId, room] of rooms.entries()) {
        if (room.instructorSocketId === socket.id) {
          rooms.delete(classId);
        } else if (room.students.has(socket.id)) {
          removeStudent(classId, socket.id);
        }
      }
    });
  });
};
