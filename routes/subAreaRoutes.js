const express = require("express");
const Subarea = require("../mongodb/models/subArea");
const Area = require("../mongodb/models/area");
const app = express.Router();

// Create a subarea
app.post("/", async (req, res) => {
  try {
    const subarea = await Subarea.create(req.body);
    const area = await Area.findById(subarea.area);
    area.subareas.push(subarea._id);
    await area.save();
    res.status(201).json(subarea);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subarea" });
  }
});

// Get all subareas
app.get("/", async (req, res) => {
  try {
    const subareas = await Subarea.find().sort({ order: "ASC" });
    res.json(subareas);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve subareas" });
  }
});

// Get a single subarea by ID
app.get("/get-subarea", async (req, res) => {
  try {
    const { id } = req.body;
    const subarea = await Subarea.findById(id);
    if (!subarea) {
      return res.status(404).json({ error: "Subarea not found" });
    }
    res.json(subarea);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve subarea" });
  }
});

// Update a subarea by ID
app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const subarea = await Subarea.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!subarea) {
      return res.status(404).json({ error: "Subarea not found" });
    }
    res.json(subarea);
  } catch (error) {
    res.status(500).json({ error: "Failed to update subarea" });
  }
});

// Delete a subarea by ID
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subarea = await Subarea.findByIdAndRemove(id);
    if (!subarea) {
      return res.status(404).json({ error: "Subarea not found" });
    }

    const area = await Area.findById(subarea.area);
    area.subareas.pull(subarea._id);
    await area.save();

    res.json({ message: "Subarea deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subarea" });
  }
});

module.exports = app;