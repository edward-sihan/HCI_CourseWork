const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["chair", "table", "sofa", "bed", "cabinet", "other"],
    required: true,
  },
  width: { type: Number, required: true },
  length: { type: Number, required: true },
  height: { type: Number, required: true },
  color: { type: String, required: true },
  defaultColor: { type: String, required: true },
  modelUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  objModelPath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
