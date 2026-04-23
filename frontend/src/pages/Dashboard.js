import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const userId = localStorage.getItem("userId");

  // State for items list
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for add/edit form
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = adding, object = editing
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "lost",
    location: "",
  });

  // Fetch all items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch items from backend (with optional search)
  const fetchItems = async (search = "") => {
    setLoading(true);
    try {
      const query = search ? `?name=${search}` : "";
      const { data } = await API.get(`/items${query}`);
      setItems(data);
    } catch (err) {
      setError("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchItems(value);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset the form to defaults
  const resetForm = () => {
    setFormData({ title: "", description: "", category: "", type: "lost", location: "" });
    setEditingItem(null);
    setShowForm(false);
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingItem) {
        // Update existing item
        await API.put(`/items/${editingItem._id}`, formData);
        setSuccess("Item updated successfully!");
      } else {
        // Add new item
        await API.post("/items", formData);
        setSuccess("Item added successfully!");
      }
      resetForm();
      fetchItems(searchTerm);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  // Start editing an item — fill form with existing data
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      type: item.type,
      location: item.location,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Delete an item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await API.delete(`/items/${id}`);
      setSuccess("Item deleted successfully!");
      fetchItems(searchTerm);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  // Logout — clear localStorage and redirect
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  // Auto-clear success/error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="dashboard">
      {/* --- Top Navbar --- */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <span className="nav-icon">📦</span>
          <h2>Lost & Found</h2>
        </div>
        <div className="nav-right">
          <span className="nav-user">👋 Hi, {userName}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* --- Messages --- */}
        {error && <div className="msg msg-error">{error}</div>}
        {success && <div className="msg msg-success">{success}</div>}

        {/* --- Search & Add Controls --- */}
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search items by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
            id="search-input"
          />
          <button
            onClick={() => {
              if (showForm) {
                // Cancel — close form and reset
                resetForm();
              } else {
                // Open the form
                setShowForm(true);
                setEditingItem(null);
                setFormData({ title: "", description: "", category: "", type: "lost", location: "" });
              }
            }}
            className="btn-add"
            id="btn-add-item"
          >
            {showForm ? "✕ Cancel" : "+ Add Item"}
          </button>
        </div>

        {/* --- Add / Edit Form --- */}
        {showForm && (
          <div className="item-form-card">
            <h3>{editingItem ? "✏️ Edit Item" : "➕ Add New Item"}</h3>
            <form onSubmit={handleSubmit} className="item-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Blue Wallet"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="e.g. Accessories"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the item in detail..."
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Library, Cafeteria"
                    value={formData.location}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit">
                {editingItem ? "Update Item" : "Add Item"}
              </button>
            </form>
          </div>
        )}

        {/* --- Items List --- */}
        <div className="items-section">
          <h3 className="items-heading">
            📋 All Items ({items.length})
          </h3>

          {loading ? (
            <p className="loading-text">Loading items...</p>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No items found. Be the first to add one!</p>
            </div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item._id} className={`item-card ${item.type}`}>
                  {/* Type badge */}
                  <span className={`type-badge ${item.type}`}>
                    {item.type === "lost" ? "🔴 Lost" : "🟢 Found"}
                  </span>

                  <h4 className="item-title">{item.title}</h4>
                  <p className="item-desc">{item.description}</p>

                  <div className="item-meta">
                    <span>📁 {item.category}</span>
                    <span>📍 {item.location}</span>
                  </div>

                  <div className="item-footer">
                    <span className="item-user">
                      👤 {item.user?.name || "Unknown"}
                    </span>
                    <span className="item-date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Show edit/delete only for items the current user owns */}
                  {item.user?._id === userId && (
                    <div className="item-actions">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn-edit"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn-delete"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
