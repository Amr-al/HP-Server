const express = require("express");
const Area = require("../mongodb/models/area");
const Subarea = require("../mongodb/models/subArea");
const PropertyType = require("../mongodb/models/propertyType");
const FurnitureSetting = require("../mongodb/models/furnitureSetting");
const { watermarkUpload } = require("../middleware/fileUplaod");
const { changeWatermarks } = require("../middleware/addWatermark");
const Currency = require("../mongodb/models/currency");
const aboutus = require("../mongodb/models/aboutus");
const MetaLinks = require("../mongodb/models/metalinks");
const property = require("../mongodb/models/property");
const app = express.Router();

app.get("/allinput", async (req, res) => {
  try {
    const areas = await Area.find().sort({ order: "ASC" }).populate("subareas");
    const subAreas = await Subarea.find().sort({ order: "ASC" });
    const propertyTypes = await PropertyType.find();
    const furnitureSetting = await FurnitureSetting.find();
    res.send({
      areas,
      subAreas,
      propertyTypes,
      furnitureSetting,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/getcurrency", async (req, res) => {
  try {
    const currency = await Currency.findOne({});
    res.send({ currency: currency, message: "success" });
  } catch (err) {
    console.error(err);
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});
app.post(
  "/changewatermarks",
  watermarkUpload("image"),
  changeWatermarks(),
  async (req, res) => {
    res.send({ message: "request sent" });
  }
);
app.post("/changecurrency", async (req, res) => {
  try {
    const currency = await Currency.findOne({});
    currency.USD = req.body.USD;
    currency.EUR = req.body.EUR;
    currency.save();
    res.send({ currency: currency, message: "success" });
  } catch (err) {
    console.error(err);
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});
app.post("/changeaboutus", async function (req, res) {
  try {
    const aboutDesc = await aboutus.findOne({});
    aboutDesc.description = req.body.description;
    aboutDesc.descriptionAr = req.body.descriptionAr;
    await aboutDesc.save();
    res.send({ message: "success" });
  } catch (err) {
    console.log(err);

    res.status(500).send({ message: err.message });
  }
});
app.post("/changelang", async function (req, res) {
  try {
    let {
      type,
      propertyType,
      location: area,
      subArea,
      title,
      refNumber,
    } = req.body;
    const lang = req.headers["accept-language"];

    if (lang == "ar") {
      if (type) {
        if (type === "rent") {
          type = "إيجار";
        } else if (type === "sale") {
          type = "بيع";
        } else {
          type = "إيجار-أو-بيع";
        }
      }
      if (propertyType) {
        if (propertyType == "properties") {
          propertyType = "عقارات";
        } else {
          const propertyTypeData = await PropertyType.findOne({
            name: { $regex: propertyType.split("-").join(" "), $options: "i" },
          });
          propertyType = propertyTypeData.nameAr ? propertyTypeData.nameAr : propertyTypeData.name;
        }
      }
      if (area) {
        if (area == "location") {
          area = "منطقة";
        } else {
          const areaData = await Area.findOne({
            name: { $regex: area.split("-").join(" "), $options: "i" },
          });
          area = areaData.nameAr ? areaData.nameAr : areaData.name;
        }
      }
      if (subArea) {
        const subAreaData = await Subarea.findOne({
          name: { $regex: subArea.split("-").join(" "), $options: "i" },
        });
        subArea = subAreaData.nameAr ? subAreaData.nameAr : subAreaData.name;
      }
      if (title) {
        const propertyData = await property.findOne({ refNumber });
        title = (propertyData.titleAr ? propertyData.titleAr : propertyData.title) + "-" + propertyData.refNumber;
      }
    } else {
      if (type) {
        if (type === "إيجار") {
          type = "rent";
        } else if (type === "بيع") {
          type = "sale";
        } else {
          type = "for-rent-or-sale";
        }
      }
      if (propertyType) {
        if (propertyType == "عقارات") {
          propertyType = "properties";
        } else {
          const propertyTypeData = await PropertyType.findOne({
            nameAr: {
              $regex: propertyType.split("-").join(" "),
              $options: "i",
            },
          });
          propertyType = propertyTypeData.name;
        }
      }
      if (area) {
        if (area === "منطقة") {
          area = "location";
        } else {
          const areaData = await Area.findOne({
            nameAr: { $regex: area.split("-").join(" "), $options: "i" },
          });
          area = areaData.name;
        }
      }
      if (subArea) {
        const subAreaData = await Subarea.findOne({
          nameAr: { $regex: subArea.split("-").join(" "), $options: "i" },
        });
        subArea = subAreaData.name;
      }
      if (title) {
        const propertyData = await property.findOne({ refNumber });
        title = propertyData.title + "-" + propertyData.refNumber;
      }
    }
    let url = `/`;
    if (type) url = url + type;
    if (propertyType) url = url + "/" + propertyType;
    if (area) url = url + "/" + area;
    if (subArea) url = url + "/" + subArea;
    if (title) url = url + "/" + title;
    res.send({
      message: "success",
      url: url.toLowerCase().split(" ").join("-"),
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({ message: err.message });
  }
});
app.get("/getaboutus", async function (req, res) {
  try {
    const aboutDesc = await aboutus.findOne({});
    res.send({ message: "success", aboutus: aboutDesc });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});
app.post("/addmeta", async function (req, res) {
  try {
    const { link, title, description, keywords, article } = req.body;
    const meta = new MetaLinks({
      link: link,
      title: title,
      description: description,
      keywords: keywords,
      article
    });
    await meta.save();
    res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});
app.get("/getallmeta", async function (req, res) {
  try {
    const metalinks = await MetaLinks.find();
    res.send({ message: "success", meta: metalinks });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});
app.post("/getmeta", async function (req, res) {
  try {
    const meta = await MetaLinks.findOne({ link: req.body.link });
    res.send({ message: "success", meta });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});
app.put("/editmeta", async function (req, res) {
  try {
    console.log(req.body);
    const meta = await MetaLinks.findOneAndUpdate(
      { _id: req.body.id },
      req.body.formData
    );
    if (meta) await meta.save();
    res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});
app.delete('/deletemeta/:id', async function (req, res) {
  console.log(req.params.id);
  try {
     await MetaLinks.findOneAndDelete(
      { _id: req.params.id },
    );
    res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});
module.exports = app;
