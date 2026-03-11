const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const { protect } = require("../middleware/auth");

// Helper to generate a unique 6-character code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @route   POST /api/rooms/create
// @desc    Create a new room and set the creator as Host
router.post("/create", protect, async (req, res) => {
  try {
    const roomCode = generateRoomCode();

    // req.user.id comes from the 'protect' middleware
    const newRoom = await Room.create({
      roomCode,
      host: req.user.id,
      participants: [
        {
          userId: req.user.id,
          username: req.body.username || "Host",
          role: "Host",
        },
      ],
    });

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/rooms/:code
// @desc    Check if a room exists before joining
router.get("/:code", async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.code });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/rooms/:code/messages
// @desc    Get chat history for a room
router.get("/:code/messages", async (req, res) => {
  try {
    const Message = require("../models/message");
    const messages = await Message.find({ roomCode: req.params.code })
      .sort({ timestamp: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
