const express = require("express");
const Tenant = require("../mongodb/models/tenant");
const { tenantUpload } = require("../middleware/fileUplaod");
const app = express.Router();

app.get("/count", async (req, res) => {
  try {
    const count = await Blog.countDocuments({});
    // console.log(count)
    res.json({ count: count });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/", tenantUpload(), async (req, res) => {
  try {
    const {
      ownerName,
      ownerPhone,
      tenantName,
      tenantPhone,
      propertyType,
      address,
      expiry,
      email,
      rentalValue, rentalDate,
    } = req.body
    const tenant = new Tenant({
      ownerName,
      ownerPhone,
      tenantName,
      tenantPhone,
      propertyType,
      address,
      expiry,
      email,
      rentalValue,
      rentalDate,
      IDImage: req.files["IDImage"][0].filename,
      passportImage: req.files["passportImage"][0].filename,
      contractImage: req.files["contractImage"][0].filename,
    });
    await tenant.save();
    res.send({ message: "Success" })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all blogs
app.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 16 } = req.query;
    const tenants = await Tenant.find().limit(limit * 1).skip((page - 1) * limit);
    const total = await Tenant.count();
    res.send({
      tenants, message: "success",
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/expiring", async (req, res) => {
  try {
    let { page = 1, limit = 16 } = req.query;

    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    const tenants = await Tenant.find({ expiry: { $lte: thirtyDaysFromNow } }).limit(limit * 1).skip((page - 1) * limit);
    const total = await Tenant.count();
    res.send({
      tenants, message: "success",
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id)
    res.send({
      tenant, message: "success",

    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/:id", tenantUpload(), async (req, res) => {
  try {
    console.log(req.body)
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, { $set: req.body });
    tenant.save()
    if (tenant) {
      res.send({ message: "Edited Successfully" });
    } else {
      res.status(404).json({ error: "Tenant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Tenant" });
  }
});
app.delete("/:id", async (req, res) => {
  try {
    await Tenant.findByIdAndRemove(req.params.id);
    res.send({
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = app;