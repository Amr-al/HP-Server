const express = require("express");
const PropertyType = require("../mongodb/models/propertyType");
const app = express.Router();

app.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const propertyType = await PropertyType.create(req.body);
    res.status(201).json(propertyType);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all areas
app.get("/", async (req, res) => {
  try {
    const propertyTypes = await PropertyType.find();
    res.json(propertyTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get an area by ID
app.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.body;
    const area = await PropertyType.findById(id);
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

    const area = await PropertyType.findByIdAndUpdate(id, req.body, {
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
    const area = await PropertyType.findByIdAndRemove(id);
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