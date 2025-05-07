const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product-controller");

const router = express.Router();

// @route GET /api/products
// @desc Get all products
// @access Public
router.get("/", getAllProducts);

// @route GET /api/products/:id
// @desc Get single product
// @access Public
router.get("/:id", getProductById);

// @route POST /api/products
// @desc Create a product
// @access Public
router.post("/", createProduct);

// @route PUT /api/products/:id
// @desc Update a product
// @access Public
router.put("/:id", updateProduct);

// @route DELETE /api/products/:id
// @desc Delete a product
// @access Public
router.delete("/:id", deleteProduct);

module.exports = router;
