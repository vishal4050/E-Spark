export const rooms = new Map();

export const createRoom = (classId, instructorSocketId) => {
  rooms.set(classId, {
    instructorSocketId,
    students: new Set(),
    teacherReady: false,
  });
};

export const getRoom = (classId) => rooms.get(classId);

export const addStudent = (classId, socketId) => {
  rooms.get(classId)?.students.add(socketId);
};

export const removeStudent = (classId, socketId) => {
  rooms.get(classId)?.students.delete(socketId);
};

export const markTeacherReady = (classId, socketId) => {
  const room = rooms.get(classId);
  if (!room) return;
  room.teacherReady = true;
  room.instructorSocketId = socketId;
};
