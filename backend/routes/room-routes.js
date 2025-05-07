const express = require("express");
const {
  getUserRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/room-controller");

const router = express.Router();

// @route GET /api/rooms
// @desc Get all rooms for a user
// @access Public
router.get("/", getUserRooms);

// @route GET /api/rooms/:id
// @desc Get single room
// @access Public
router.get("/:id", getRoomById);

// @route POST /api/rooms
// @desc Create a room
// @access Public
router.post("/", createRoom);

// @route PUT /api/rooms/:id
// @desc Update a room
// @access Public
router.put("/:id", updateRoom);

// @route DELETE /api/rooms/:id
// @desc Delete a room
// @access Public
router.delete("/:id", deleteRoom);

module.exports = router;
