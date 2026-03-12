const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/mongo");
const User = require('./src/models/user');
const Room = require('./src/models/Room');
const authRoutes = require('./src/routes/authRoutes');
const roomRoutes = require('./src/routes/roomRoutes'); // IMPORT ROUTES
const Message = require('./src/models/message'); // Import the model at the top

dotenv.config();
const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : "*";
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);    // added roomRoutes

const { errorHandler } = require("./src/middleware/errorHandler");
app.use(errorHandler);

// Socket.IO Setup
const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("send_message", async (data) => {
    try {
      // Save message to MongoDB
      const newMessage = await Message.create({
        roomCode: data.roomCode,
        sender: data.userId,
        username: data.username,
        text: data.text,
      });

      // Broadcast the message to everyone in the room
      io.to(data.roomCode).emit("receive_message", newMessage);
    } catch (err) {
      console.log("Chat error:", err);
    }
  });

  // 1. JOIN ROOM & ASSIGN ROLE
  socket.on("join_room", async ({ roomCode, userId, username }) => {
    socket.join(roomCode);

    // Track user info on socket for disconnect cleanup
    socket.userId = userId;
    socket.username = username;
    socket.roomCode = roomCode;

    // Find room or create a temporary state
    let room = await Room.findOne({ roomCode });
    if (room) {
      // Check if user is already in room, if not add them
      const exists = room.participants.find(
        (p) => p.userId.toString() === userId,
      );
      if (!exists) {
        room.participants.push({ userId, username, role: "Participant" });
        await room.save();
      }
      // Send the current video state to the new joiner so they sync up
      socket.emit("room_state", {
        videoId: room.currentVideoId,
        currentTime: room.currentTime,
        isPlaying: room.isPlaying,
      });
    }

    console.log(`👤 ${username} joined ${roomCode}`);
    io.to(roomCode).emit("user_joined", { username, userId });
  });

  // 2. VIDEO CONTROL (PLAY/PAUSE/SEEK)
  socket.on("video_action", async ({ roomCode, userId, action, time }) => {
    const room = await Room.findOne({ roomCode });
    if (!room) return;

    // CHECK PERMISSION: Only Host or Moderator can control
    const user = room.participants.find((p) => p.userId.toString() === userId);
    if (user && (user.role === "Host" || user.role === "Moderator")) {
      // Update Database state
      room.currentTime = time;
      room.isPlaying = action === "play";
      await room.save();

      // Broadcast to everyone else
      socket.to(roomCode).emit("video_state_update", { action, time });
    } else {
      // Optional: Send a "Denied" message to the user
      socket.emit(
        "error_message",
        "You do not have permission to control the video.",
      );
    }
  });

  // 3. PROMOTE TO MODERATOR
  socket.on("promote_user", async ({ roomCode, adminId, targetUserId }) => {
    const room = await Room.findOne({ roomCode });
    const admin = room.participants.find(
      (p) => p.userId.toString() === adminId,
    );

    if (admin && admin.role === "Host") {
      const target = room.participants.find(
        (p) => p.userId.toString() === targetUserId,
      );
      if (target) {
        target.role = "Moderator";
        await room.save();
        io.to(roomCode).emit("role_updated", {
          userId: targetUserId,
          newRole: "Moderator",
        });
      }
    }
  });

  // 4. CHANGE VIDEO (sync across all clients)
  socket.on("change_video", async ({ roomCode, userId, videoId }) => {
    const room = await Room.findOne({ roomCode });
    if (!room) return;

    const user = room.participants.find((p) => p.userId.toString() === userId);
    if (user && (user.role === "Host" || user.role === "Moderator")) {
      room.currentVideoId = videoId;
      room.currentTime = 0;
      room.isPlaying = false;
      await room.save();

      // Broadcast to everyone else in the room
      socket.to(roomCode).emit("video_changed", { videoId });
    } else {
      socket.emit("error_message", "You do not have permission to change the video.");
    }
  });

  // 5. LEAVE ROOM
  socket.on("leave_room", async ({ roomCode, userId }) => {
    try {
      const room = await Room.findOne({ roomCode });
      if (room) {
        room.participants = room.participants.filter(
          (p) => p.userId.toString() !== userId,
        );
        await room.save();
      }
      socket.leave(roomCode);
      io.to(roomCode).emit("user_left", { userId, username: socket.username });
      console.log(`👋 ${socket.username} left ${roomCode}`);
    } catch (err) {
      console.log("Leave room error:", err);
    }
  });

  // DISCONNECT — clean up participant from any room they were in
  socket.on("disconnect", async () => {
    console.log("🔥 User disconnected:", socket.id);
    try {
      if (socket.roomCode && socket.userId) {
        const room = await Room.findOne({ roomCode: socket.roomCode });
        if (room) {
          room.participants = room.participants.filter(
            (p) => p.userId.toString() !== socket.userId,
          );
          await room.save();
          io.to(socket.roomCode).emit("user_left", {
            userId: socket.userId,
            username: socket.username,
          });
        }
      }
    } catch (err) {
      console.log("Disconnect cleanup error:", err);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
