const express = require("express");
const {
  getUserDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} = require("../controllers/design-controller");

const router = express.Router();

// @route GET /api/designs
// @desc Get all designs for a user
// @access Public
router.get("/", getUserDesigns);

// @route GET /api/designs/:id
// @desc Get single design
// @access Public
router.get("/:id", getDesignById);

// @route POST /api/designs
// @desc Create a design
// @access Public
router.post("/", createDesign);

// @route PUT /api/designs/:id
// @desc Update a design
// @access Public
router.put("/:id", updateDesign);

// @route DELETE /api/designs/:id
// @desc Delete a design
// @access Public
router.delete("/:id", deleteDesign);

module.exports = router;
