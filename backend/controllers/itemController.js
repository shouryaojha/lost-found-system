const Item = require("../models/Item");

// @desc    Add a new item (lost or found)
// @route   POST /api/items
// @access  Private (logged-in users only)
const addItem = async (req, res) => {
  try {
    const { title, description, category, type, location } = req.body;

    // Validate required fields
    if (!title || !description || !category || !type || !location) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Create item with the logged-in user's ID
    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      user: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Add Item Error:", error.message);
    res.status(500).json({ message: "Server error while adding item" });
  }
};

// @desc    Get all items (with optional search by name)
// @route   GET /api/items  OR  GET /api/items/search?name=xyz
// @access  Public
const getItems = async (req, res) => {
  try {
    // If a "name" query param is provided, search by title
    const searchQuery = req.query.name
      ? { title: { $regex: req.query.name, $options: "i" } } // Case-insensitive search
      : {};

    // Fetch items, populate user name, sort newest first
    const items = await Item.find(searchQuery)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error("Get Items Error:", error.message);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private (only the owner can update)
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the logged-in user is the owner of this item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    // Update item with new data
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc & run validators
    );

    res.json(updatedItem);
  } catch (error) {
    console.error("Update Item Error:", error.message);
    res.status(500).json({ message: "Server error while updating item" });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (only the owner can delete)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the logged-in user is the owner of this item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete Item Error:", error.message);
    res.status(500).json({ message: "Server error while deleting item" });
  }
};

module.exports = { addItem, getItems, updateItem, deleteItem };
