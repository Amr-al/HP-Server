const express = require("express");
const Area = require("../mongodb/models/area");
const Property = require("../mongodb/models/property");
const app = express.Router();

// Create an area
app.post("/", async (req, res) => {
  try {
    const area = await Area.create(req.body);
    res.status(201).json(area);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/all", async (req, res) => {
  try {
    const areas = await Area.find().sort({ order: "ASC" });
    res.send({ areas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all areas with count
app.get("/", async (req, res) => {
  try {
    const areas = await Property.aggregate([
      {
        $group: {
          _id: { area: "$area", subarea: "$subarea" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.area",
          subareas: {
            $push: { subarea: "$_id.subarea", count: "$count" },
          },
          count: { $sum: "$count" },
        },
      },
      {
        $lookup: {
          from: "areas",
          localField: "_id",
          foreignField: "_id",
          as: "areaData",
        },
      },
      {
        $unwind: "$areaData",
      },
      {
        $project: {
          _id: 1,
          subareas: 1,
          count: 1,
          name: "$areaData.name",
          nameAr: "$areaData.nameAr",
          order: "$areaData.order", // assuming 'order' field is in 'areas' collection
        },
      },
      {
        $unwind: "$subareas",
      },
      {
        $lookup: {
          from: "subareas",
          localField: "subareas.subarea",
          foreignField: "_id",
          as: "subareaData",
        },
      },
      {
        $unwind: "$subareaData",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          nameAr: { $first: "$nameAr" },
          count: { $first: "$count" },
          order: { $first: "$order" }, // assuming 'order' field is in 'areas' collection
          subareas: {
            $push: {
              subarea: {
                _id: "$subareas.subarea",
                name: "$subareaData.name",
                nameAr: "$subareaData.nameAr",
              },
              count: "$subareas.count",
            },
          },
        },
      },
      {
        $unwind: "$subareas",
      },

      // Add the $sort stage to sort the subareas array by name
      {
        $sort: {
          "subareas.subarea._id": 1,
        },
      },

      // Group again to reconstruct the subareas array
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          nameAr: { $first: "$nameAr" },
          count: { $first: "$count" },
          order: { $first: "$order" },
          subareas: {
            $push: "$subareas",
          },
        },
      },
    ]).sort({ order: "ASC" });
    // const areas = await Area.find().populate("subareas")
    res.send({ areas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Define the route to get all areas with subareas
app.get("/areas-subareas", async (req, res) => {
  try {
    // Query all areas with their subareas
    const areasWithSubareas = await Area.find().populate("subareas", "name");

    // Map the result to the desired response format
    const response = areasWithSubareas.map((area) => ({
      name: area.name,
      subAreas: area.subareas.map((subarea) => ({ name: subarea.name })),
    }));

    // Send the response
    res.json(response);
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get an area by ID
app.get("/get-area", async (req, res) => {
  try {
    const { id } = req.body;
    const area = await Area.findById(id);
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
