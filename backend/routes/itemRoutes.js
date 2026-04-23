const express = require("express");
const router = express.Router();
const {
  addItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/items — Get all items (public, also handles ?name=xyz search)
router.get("/", getItems);

// POST /api/items — Add a new item (protected)
router.post("/", protect, addItem);

// PUT /api/items/:id — Update an item (protected, owner only)
router.put("/:id", protect, updateItem);

// DELETE /api/items/:id — Delete an item (protected, owner only)
router.delete("/:id", protect, deleteItem);

module.exports = router;
