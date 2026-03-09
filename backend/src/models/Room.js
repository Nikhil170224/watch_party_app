const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  currentVideoId: { type: String, default: "dQw4w9WgXcQ" }, // Default YouTube video
  isPlaying: { type: Boolean, default: false },
  currentTime: { type: Number, default: 0 },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
      role: {
        type: String,
        enum: ["Host", "Moderator", "Participant"],
        default: "Participant",
      },
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
