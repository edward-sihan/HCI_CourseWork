const mongoose = require("mongoose");

const FurniturePositionSchema = new mongoose.Schema({
  furnitureId: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
  rotation: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
  color: { type: String, required: true },
  shade: { type: Number, default: 0 },
  roughness: { type: Number },
  metalness: { type: Number },
});

const RoomDetailsSchema = new mongoose.Schema({
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  height: { type: Number, required: true },
  wallColor: { type: String, required: true },
  floorColor: { type: String, required: true },
});

const DesignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomId: { type: String, required: true },
  userId: { type: String, required: true }, // Store Clerk user ID as string
  furniture: [FurniturePositionSchema],
  roomDetails: RoomDetailsSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Design", DesignSchema);
