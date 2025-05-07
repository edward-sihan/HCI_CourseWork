const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  height: { type: Number, required: true },
  wallColor: { type: String, required: true },
  floorColor: { type: String, required: true },
  userId: { type: String, required: true }, // Store Clerk user ID as string
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", RoomSchema);
