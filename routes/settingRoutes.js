const express = require("express");
const Setting = require("../mongodb/models/setting");
const app = express.Router();

// Route to add a new setting
app.post("/", async (req, res) => {
  try {
    const existingSetting = await Setting.findOne();
    let setting;
    if (existingSetting) {
      // If a setting document already exists, update it
      setting = await Setting.findByIdAndUpdate(existingSetting._id, req.body, {
        new: true,
      });
    } else {
      // If no setting document exists, create a new one
      setting = new Setting(req.body);
      await setting.save();
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// Route to get all settings
app.get("/", async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;