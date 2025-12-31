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

    // ================= STUDENT LEAVE =================
    socket.on("leave-class", ({ classId }) => {
      const room = getRoom(classId);
      if (!room) return;

      if (room.students.has(socket.id)) {
        room.students.delete(socket.id);

        console.log("🚪 STUDENT LEFT:", socket.id);

        io.to(room.instructorSocketId).emit("student-left", {
          studentSocketId: socket.id,
        });
      }
    });

    // ================= END CLASS (TEACHER) =================
    socket.on("end-class", ({ classId }) => {
      const room = getRoom(classId);
      if (!room) return;

      io.to(classId).emit("class-ended");
      rooms.delete(classId);

      console.log("🛑 CLASS ENDED:", classId);
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

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      console.log("❌ DISCONNECTED:", socket.id);

      for (const [classId, room] of rooms.entries()) {
        // Teacher disconnected
        if (room.instructorSocketId === socket.id) {
          io.to(classId).emit("class-ended");
          rooms.delete(classId);
          console.log("🧹 ROOM CLOSED:", classId);
        }

        // Student disconnected
        if (room.students.has(socket.id)) {
          room.students.delete(socket.id);
          io.to(room.instructorSocketId).emit("student-left", {
            studentSocketId: socket.id,
          });
          console.log("🧹 STUDENT REMOVED:", socket.id);
        }
      }
    });
  });
};
