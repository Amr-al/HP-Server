const express = require("express");
const Location = require("../mongodb/models/location");
const app = express.Router();

// Create an location
app.post("/", async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(area);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all locations
app.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an location by ID
app.get("/get-location", async (req, res) => {
  try {
    const { id } = req.body;
    const location = await Location.findById(id);
    if (area) {
      res.json(area);
    } else {
      res.status(404).json({ message: "Area not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an area by ID
app.put("/:id", async (req, res) => {
  try {

    const { id } = req.params;
    console.log(req);

    const area = await Area.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (area) {
      res.json(area);
    } else {
      res.status(404).json({ message: "Area not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an area by ID
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const area = await Area.findByIdAndRemove(id);
    if (area) {
      res.status(201).json({ message: "Area deleted" });
    } else {
      res.status(404).json({ message: "Area not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;