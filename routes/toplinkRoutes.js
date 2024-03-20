const express = require("express");
const TopLink = require("../mongodb/models/topLink");
const app = express.Router();

// Create a new footer link
app.post("/", async (req, res) => {
  try {
    const { title, titleAr, link, linkAr, order } = req.body;
    const topLink = new TopLink({ title, titleAr, link, linkAr, order });
    await topLink.save();
    res.json(topLink);
  } catch (error) {
    res.status(500).json({ error: "Failed to create footer link" });
  }
});

// Get all footer links
app.get("/", async (req, res) => {
  try {
    const topLinks = await TopLink.find().sort({ order: "ASC" });
    res.json(topLinks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve footer links" });
  }
});

// Get a specific footer link by ID
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const topLink = await TopLink.findById(id);
    if (!topLink) {
      res.status(404).json({ error: "Footer link not found" });
    } else {
      res.json(topLink);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve footer link" });
  }
});

// Update a specific footer link by ID
app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, titleAr, link, linkAr, order } = req.body;
    const updatedTopLink = await TopLink.findByIdAndUpdate(
      id,
      { title, titleAr, link, linkAr, order },
      { new: true }
    );
    if (!updatedTopLink) {
      res.status(404).json({ error: "Footer link not found" });
    } else {
      res.json(updatedTopLink);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update footer link" });
  }
});

// Delete a specific footer link by ID
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTopLink = await TopLink.findByIdAndRemove(id);
    if (!deletedTopLink) {
      res.status(404).json({ error: "Footer link not found" });
    } else {
      res.json(deletedTopLink);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete footer link" });
  }
});


module.exports = app;