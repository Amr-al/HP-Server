const express = require("express");
const Property = require("../mongodb/models/property");
const PropertyType = require("../mongodb/models/propertyType");
const Area = require("../mongodb/models/area");
const Subarea = require("../mongodb/models/subArea");
const FurnitureSetting = require("../mongodb/models/furnitureSetting");
const { multiFiles, mainWithImage } = require("../middleware/fileUplaod");
const {
  addWatermark,
  addWatermarkNoMain,
  addWatermarkMain,
} = require("../middleware/addWatermark");
const app = express.Router();
const fs = require("fs");
const path = require("path");
const Currency = require("../mongodb/models/currency");

app.put(
  "/editmainimage/:id",
  mainWithImage(),
  addWatermarkMain(),
  async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      const mainimage = {
        image: req.files["mainimage"][0].filename,
        placeholder: req.files["mainimage"][0].placeholder,
      };
      property.mainimage = mainimage;
      property.save();
      if (property) {
        res.json({ message: "property main image changed" });
      } else {
        res.status(404).json({ error: "Property not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update main image of the property" });
    }
  }
);

app.post("/", mainWithImage(), addWatermark(), async (req, res) => {
  try {
    const images = req.files["images"].map((file) => {
      return { image: file.filename, placeholder: file.placeholder };
    });
    const mainimage = {
      image: req.files["mainimage"][0].filename,
      placeholder: req.files["mainimage"][0].placeholder,
    };
    const {
      employee,
      type,
      currency,
      propertyType,
      title,
      titleAr,
      description,
      descriptionAr,
      isResidential,
      isCommercial,
      isFeatured,
      price,
      tags,
      tagsAr,
      youtubeLink,
      beds,
      baths,
      rating,
      propertyArea,
      furnitureStatus,
      area,
      subarea,
      ownerName,
      ownerPhone,
      ownerAddress,
      ceramics,
      parquet,
      HDF,
      marble,
      porcelain,
      others,
      airConditioning,
      centralAirCondition,
      oneBalconyView,
      twoBalconyView,
      oneMasterBedroom,
      twoMasterBedroom,
      threeMasterBedroom,
      fourMasterBedroom,
      internet,
      maidsRoom,
      laundryRoom,
      jacuzzi,
      privateEntrance,
      privateGarden,
      privateSwimmingPool,
      swimmingpoolUse,
      compound,
      walkinCloset,
      kitchenAppliances,
      closetoFrenchSchool,
      closetoCAC,
      transportNerdy,
      shoppingNerdy,
      closetoSchools,
      closetoRestaurants,
      closetoGym,
      closetoMetroStation,
      security,
      quietArea,
      floorNumber,
      officeRoom,
      builtinWardrobe,
      internetAccess,
      elevator,
      studyroom,
      terrace,
      surveillance,
      coveredParking,
      storage,
      sharedSwimmingPool,
      petsAllowed,
    } = req.body;
    const areaData = await Area.findById(area);
    const propertyTypeData = await PropertyType.findById(propertyType);

    let typeAr = type == "sale" ? "بيع" : "إيجار";
    const docRef = await Property.findOne().sort({ refNumber: -1 });
    const highestRenew = await Property.findOne().sort({ renewNumber: -1 });

    let refNumber = 1;
    if (docRef) refNumber = docRef.refNumber + 1;
    const property = await Property.create({
      refNumber,
      employee: employee,
      type: type,
      currency: currency,
      propertyType: propertyType,
      title,
      titleAr,
      description,
      descriptionAr,
      isResidential: isResidential,
      isCommercial: isCommercial,
      isFeatured: isFeatured,
      images: images,
      mainimage,
      price,
      renewNumber: highestRenew.renewNumber + 1,
      tags: [
        ...tags,
        `for ${type}`,
        `${areaData.name}`,
        `${type} in ${areaData.name}`,
        `${propertyTypeData.name}`,
        `${propertyTypeData.name} for ${type}`,
        `${areaData.name} real estate`,
      ],
      tagsAr: [
        ...tagsAr,
        `لل${typeAr}`,
        `${areaData.nameAr}`,
        `${typeAr} في ${areaData.nameAr}`,
        `${propertyTypeData.nameAr}`,
        `${propertyTypeData.nameAr} لل${typeAr}`,
        `عقارات ${areaData.nameAr}`,
      ],
      youtubeLink,
      beds,
      baths,
      floorNumber,
      rating,
      propertyArea,
      furnitureStatus,
      area,
      subarea,
      ownerName,
      ownerPhone,
      ownerAddress,
      ceramics,
      parquet,
      HDF,
      marble,
      porcelain,
      others,
      airConditioning,
      centralAirCondition,
      oneBalconyView,
      twoBalconyView,
      oneMasterBedroom,
      twoMasterBedroom,
      threeMasterBedroom,
      fourMasterBedroom,
      internet,
      maidsRoom,
      laundryRoom,
      jacuzzi,
      privateEntrance,
      privateGarden,
      privateSwimmingPool,
      swimmingpoolUse,
      compound,
      walkinCloset,
      kitchenAppliances,
      closetoFrenchSchool,
      closetoCAC,
      transportNerdy,
      shoppingNerdy,
      closetoSchools,
      closetoRestaurants,
      closetoGym,
      closetoMetroStation,
      security,
      quietArea,
      officeRoom,
      builtinWardrobe,
      internetAccess,
      elevator,
      studyroom,
      terrace,
      surveillance,
      coveredParking,
      storage,
      sharedSwimmingPool,
      petsAllowed,
    });
    res.status(201).send({ property: property, message: "Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create property" });
  }
});
app.get("/getproperties", async (req, res) => {
  try {
    let {
      type,
      propertyType,
      area,
      subArea,
      minPrice,
      maxPrice,
      minPropertyArea,
      maxPropertyArea,
      furnitureSetting,
      beds,
      baths,
      tag,
      ref,
      page = 1,
      limit = 16,
    } = req.query;
    const filter = {};
    let currencyNow = {};
    if (minPrice || maxPrice) currencyNow = await Currency.findOne({});

    if (type && type != "for-rent-or-sale" && type != "إيجار-أو-بيع") {
      if (type === "إيجار") type = "rent";
      if (type === "بيع") type = "sale";
      filter.type = { $regex: type.split("-").join(" "), $options: "i" };
    }
    if (
      propertyType &&
      propertyType != "properties" &&
      propertyType != "عقارات"
    ) {
      const propertyTypeData = await PropertyType.findOne({
        $or: [
          {
            name: { $regex: propertyType.split("-").join(" "), $options: "i" },
          },
          {
            nameAr: {
              $regex: propertyType.split("-").join(" "),
              $options: "i",
            },
          },
        ],
      });
      if (propertyTypeData) filter.propertyType = propertyTypeData._id;
    }
    if (area && area != "location" && area != "منطقة") {
      const areaData = await Area.findOne({
        $or: [
          { name: { $regex: area.split("-").join(" "), $options: "i" } },
          { nameAr: { $regex: area.split("-").join(" "), $options: "i" } },
        ],
      });
      if (areaData) filter.area = areaData._id;
    }
    if (subArea) {
      const subAreaData = await Subarea.findOne({
        $or: [
          { name: { $regex: subArea.split("-").join(" "), $options: "i" } },
          { nameAr: { $regex: subArea.split("-").join(" "), $options: "i" } },
        ],
      });
      if (subAreaData) filter.subarea = subAreaData._id;
    }
    if (beds) {
      filter.beds = beds;
    }
    if (baths) {
      filter.baths = baths;
    }
    if (furnitureSetting) {
      const furniture = await FurnitureSetting.findOne({
        $or: [
          {
            name: {
              $regex: furnitureSetting.split("-").join(" "),
              $options: "i",
            },
          },
          {
            nameAr: {
              $regex: furnitureSetting.split("-").join(" "),
              $options: "i",
            },
          },
        ],
      });
      if (furniture) {
        filter.furnitureStatus = furniture._id;
      } else {
        res.send({ properties: [], message: "success" });
        return;
      }
    }
    if (minPrice) {
      filter["$or"] = [
        {
          $and: [
            { price: { $gte: minPrice / currencyNow.USD } },
            { currency: "USD" },
          ],
        },
        {
          $and: [
            { price: { $gte: minPrice / currencyNow.EUR } },
            { currency: "EUR" },
          ],
        },
        {
          $and: [{ price: { $gte: minPrice } }, { currency: "EGP" }],
        },
      ];
    }
    if (maxPrice) {
      if (!minPrice)
        filter["$or"] = [
          {
            $and: [
              { price: { $lte: maxPrice / currencyNow.USD } },
              { currency: "USD" },
            ],
          },
          {
            $and: [
              { price: { $lte: maxPrice / currencyNow.EUR } },
              { currency: "EUR" },
            ],
          },
          {
            $and: [{ price: { $lte: maxPrice } }, { currency: "EGP" }],
          },
        ];
      else
        filter["$or"] = [
          {
            $and: [
              {
                price: {
                  $gte: minPrice / currencyNow.USD,
                  $lte: maxPrice / currencyNow.USD,
                },
              },
              { currency: "USD" },
            ],
          },
          {
            $and: [
              {
                price: {
                  $gte: minPrice / currencyNow.EUR,
                  $lte: maxPrice / currencyNow.EUR,
                },
              },
              { currency: "EUR" },
            ],
          },
          {
            $and: [
              { price: { $gte: minPrice, $lte: maxPrice } },
              { currency: "EGP" },
            ],
          },
        ];
    }
    if (minPropertyArea) {
      filter.propertyArea = { $gte: minPropertyArea };
    }
    if (maxPropertyArea) {
      if (!minPropertyArea) filter.propertyArea = { $lte: maxPropertyArea };
      else
        filter.propertyArea = { $gte: minPropertyArea, $lte: maxPropertyArea };
    }
    if (tag) {
      filter.$or = [
        { tags: { $in: [tag.split("-").join(" ")] } },
        { tagsAr: { $in: [tag.split("-").join(" ")] } },
      ];
    }
    if (ref) {
      filter.refNumber = ref;
    }
    console.error(filter);
    const properties = await Property.find(filter)
      .select({
        images: 0,
        centralAirCondition: 0,
        ceramics: 0,
        closetoCAC: 0,
        closetoFrenchSchool: 0,
        closetoGym: 0,
        closetoMetroStation: 0,
        closetoRestaurants: 0,
        closetoSchools: 0,
        compound: 0,
        fourMasterBedroom: 0,
        internet: 0,
        jacuzzi: 0,
        kitchenAppliances: 0,
        laundryRoom: 0,
        maidsRoom: 0,
        marble: 0,
        oneBalconyView: 0,
        oneMasterBedroom: 0,
        oneMasterBedroom: 0,
        others: 0,
        ownerAddress: 0,
        ownerName: 0,
        ownerPhone: 0,
        ownerEmail: 0,
        parquet: 0,
        porcelain: 0,
        HDF: 0,
        airConditioning: 0,
        privateEntrance: 0,
        privateGarden: 0,
        privateSwimmingPool: 0,
        quietArea: 0,
        security: 0,
        shoppingNerdy: 0,
        swimmingpoolUse: 0,
        threeMasterBedroom: 0,
        transportNerdy: 0,
        twoBalconyView: 0,
        twoMasterBedroom: 0,
        walkinCloset: 0,
        youtubeLink: 0,
        createdAt: 0,
        employee: 0,
        isCommercial: 0,
        isFeatured: 0,
        isResidential: 0,
        tags: 0,
        tagsAr: 0,
        rating: 0,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ renewNumber: -1, refNumber: -1 })
      .populate("furnitureStatus")
      .populate("area")
      .populate("subarea")
      .populate("propertyType");
    const total = await Property.count(filter);
    res.send({
      properties: properties,
      message: "success",
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching properties" });
  }
});
app.get("/adminall", async (req, res) => {
  try {
    const {
      type,
      propertyType,
      area,
      subArea,
      minPrice,
      maxPrice,
      minPropertyArea,
      maxPropertyArea,
      furnitureSetting,
      beds,
      baths,
      tag,
      ref,
      page = 1,
      limit = 16,
    } = req.query;
    const filter = {};
    let currencyNow = {};
    if (minPrice || maxPrice) currencyNow = await Currency.findOne({});
    if (type && type != "for-rent-or-sale" && type != "إيجار-أو-بيع") {
      if (type === "إيجار") type = "rent";
      if (type === "بيع") type = "sale";
      filter.type = { $regex: type.split("-").join(" "), $options: "i" };
    }
    if (
      propertyType &&
      propertyType != "properties" &&
      propertyType != "عقارات"
    ) {
      const propertyTypeData = await PropertyType.findOne({
        $or: [
          {
            name: { $regex: propertyType.split("-").join(" "), $options: "i" },
          },
          {
            nameAr: {
              $regex: propertyType.split("-").join(" "),
              $options: "i",
            },
          },
        ],
      });
      if (propertyTypeData) filter.propertyType = propertyTypeData._id;
    }
    if (area && area != "location" && area != "منطقة") {
      const areaData = await Area.findOne({
        $or: [
          { name: { $regex: area.split("-").join(" "), $options: "i" } },
          { nameAr: { $regex: area.split("-").join(" "), $options: "i" } },
        ],
      });
      if (areaData) filter.area = areaData._id;
    }
    if (subArea) {
      const subAreaData = await Subarea.findOne({
        $or: [
          { name: { $regex: subArea.split("-").join(" "), $options: "i" } },
          { nameAr: { $regex: subArea.split("-").join(" "), $options: "i" } },
        ],
      });
      if (subAreaData) filter.subarea = subAreaData._id;
    }
    if (beds) {
      filter.beds = beds;
    }
    if (baths) {
      filter.baths = baths;
    }
    if (furnitureSetting) {
      const furniture = await FurnitureSetting.findOne({
        $or: [
          {
            name: {
              $regex: furnitureSetting.split("-").join(" "),
              $options: "i",
            },
          },
          {
            nameAr: {
              $regex: furnitureSetting.split("-").join(" "),
              $options: "i",
            },
          },
        ],
      });
      if (furniture) {
        filter.furnitureStatus = furniture._id;
      } else {
        res.send({ properties: [], message: "success" });
        return;
      }
    }
    if (minPrice) {
      filter["$or"] = [
        {
          $and: [
            { price: { $gte: minPrice / currencyNow.USD } },
            { currency: "USD" },
          ],
        },
        {
          $and: [
            { price: { $gte: minPrice / currencyNow.EUR } },
            { currency: "EUR" },
          ],
        },
        {
          $and: [{ price: { $gte: minPrice } }, { currency: "EGP" }],
        },
      ];
    }
    if (maxPrice) {
      if (!minPrice)
        filter["$or"] = [
          {
            $and: [
              { price: { $lte: maxPrice / currencyNow.USD } },
              { currency: "USD" },
            ],
          },
          {
            $and: [
              { price: { $lte: maxPrice / currencyNow.EUR } },
              { currency: "EUR" },
            ],
          },
          {
            $and: [{ price: { $lte: maxPrice } }, { currency: "EGP" }],
          },
        ];
      else
        filter["$or"] = [
          {
            $and: [
              {
                price: {
                  $gte: minPrice / currencyNow.USD,
                  $lte: maxPrice / currencyNow.USD,
                },
              },
              { currency: "USD" },
            ],
          },
          {
            $and: [
              {
                price: {
                  $gte: minPrice / currencyNow.EUR,
                  $lte: maxPrice / currencyNow.EUR,
                },
              },
              { currency: "EUR" },
            ],
          },
          {
            $and: [
              { price: { $gte: minPrice, $lte: maxPrice } },
              { currency: "EGP" },
            ],
          },
        ];
    }
    if (minPropertyArea) {
      filter.propertyArea = { $gte: minPropertyArea };
    }
    if (maxPropertyArea) {
      if (!minPropertyArea) filter.propertyArea = { $lte: maxPropertyArea };
      else
        filter.propertyArea = { $gte: minPropertyArea, $lte: maxPropertyArea };
    }
    if (tag) {
      filter.$or = [
        { tags: { $in: [tag.split("-").join(" ")] } },
        { tagsAr: { $in: [tag.split("-").join(" ")] } },
      ];
    }
    if (ref) {
      filter.refNumber = ref;
    }

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("furnitureStatus")
      .populate("area")
      .populate("subarea")
      .populate("propertyType");
    const total = await Property.count(filter);
    res.send({
      properties: properties,
      message: "success",
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching properties" });
  }
});
app.get("/count", async (req, res) => {
  try {
    let {
      type,
      propertyType,
      area,
      subArea,
      minPrice,
      maxPrice,
      minPropertyArea,
      maxPropertyArea,
      furnitureSetting,
      beds,
      baths,
    } = req.query;
    const filter = {};
    let currencyNow = {};
    if (minPrice || maxPrice) currencyNow = await Currency.findOne({});
    if (type && (type != "for-rent-or-sale" || type != "إيجار-أو-بيع")) {
      if (type === "إيجار") type = "rent";
      if (type === "بيع") type = "sale";
      filter.type = { $regex: type.split("-").join(" "), $options: "i" };
    }
    if (
      propertyType &&
      (propertyType != "properties" || propertyType != "عقارات")
    ) {
      const propertyTypeData = await PropertyType.findOne({
        $or: [
          {
            name: { $regex: propertyType.split("-").join(" "), $options: "i" },
          },
          {
            nameAr: {
              $regex: propertyType.split("-").join(" "),
              $options: "i",
            },
          },
        ],
      });
      if (propertyTypeData) filter.propertyType = propertyTypeData._id;
    }
    if (area && (area != "location" || area != "منطقة")) {
      const areaData = await Area.findOne({
        $or: [
          { name: { $regex: area.split("-").join(" "), $options: "i" } },
          { nameAr: { $regex: area.split("-").join(" "), $options: "i" } },
        ],
      });
      if (areaData) filter.area = areaData._id;
    }
    if (subArea) {
      const subAreaData = await Subarea.findOne({
        $or: [
          { name: { $regex: subArea.split("-").join(" "), $options: "i" } },
          { nameAr: { $regex: subArea.split("-").join(" "), $options: "i" } },
        ],
      });
      if (subAreaData) filter.subarea = subAreaData._id;
    }
    if (beds) {
      filter.beds = beds;
    }
    if (baths) {
      filter.baths = baths;
    }
    if (furnitureSetting) {
      const furniture = await FurnitureSetting.findOne({
        $or: [
          {
            name: {
              $regex: furnitureSetting.split("-").join(" "),
              $options: "i",
            },
          },
          {
            nameAr: {
              $regex: furnitureSetting.split("-").join(" "),
              $options: "i",
            },
          },
        ],
      });
      if (furniture) {
        filter.furnitureStatus = furniture._id;
      } else {
        res.send({ properties: [], message: "success" });
        return;
      }
    }
    if (minPrice) {
      filter["$or"] = [
        {
          $and: [
            { price: { $gte: minPrice / currencyNow.USD } },
            { currency: "USD" },
          ],
        },
        {
          $and: [
            { price: { $gte: minPrice / currencyNow.EUR } },
            { currency: "EUR" },
          ],
        },
        {
          $and: [{ price: { $gte: minPrice } }, { currency: "EGP" }],
        },
      ];
    }
    if (maxPrice) {
      if (!minPrice)
        filter["$or"] = [
          {
            $and: [
              { price: { $lte: maxPrice / currencyNow.USD } },
              { currency: "USD" },
            ],
          },
          {
            $and: [
              { price: { $lte: maxPrice / currencyNow.EUR } },
              { currency: "EUR" },
            ],
          },
          {
            $and: [{ price: { $lte: maxPrice } }, { currency: "EGP" }],
          },
        ];
      else
        filter["$or"] = [
          {
            $and: [
              {
                price: {
                  $gte: minPrice / currencyNow.USD,
                  $lte: maxPrice / currencyNow.USD,
                },
              },
              { currency: "USD" },
            ],
          },
          {
            $and: [
              {
                price: {
                  $gte: minPrice / currencyNow.EUR,
                  $lte: maxPrice / currencyNow.EUR,
                },
              },
              { currency: "EUR" },
            ],
          },
          {
            $and: [
              { price: { $gte: minPrice, $lte: maxPrice } },
              { currency: "EGP" },
            ],
          },
        ];
    }
    if (minPropertyArea) {
      filter.propertyArea = { $gte: minPropertyArea };
    }
    if (maxPropertyArea) {
      if (!minPropertyArea) filter.propertyArea = { $lte: maxPropertyArea };
      else
        filter.propertyArea = { $gte: minPropertyArea, $lte: maxPropertyArea };
    }
    const propertiesCount = await Property.count(filter);
    res.send({ count: propertiesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});
// Route to get a specific property by ID
app.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the property by its ID in the database
    const property = await Property.findById(id).populate("furnitureStatus");

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Property found, send it as the response
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
app.get("/searchByRef/:refNumber", async (req, res) => {
  const { refNumber } = req.params;
  try {
    const property = await Property.findOne({ refNumber });
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/image/:id", async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          images: {
            _id: req.body._id,
          },
        },
      }
    );
    const imagePath = path.join(
      `${__dirname}/../uploads/properties/${req.body.name}`
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      res.json({ message: "Property Image deleted" });
    } else {
      res.json({ message: "Property Image deleted in db" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete property Image" });
  }
});
app.get("/:title/:ref", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the property by its ID in the database
    const property = await Property.findOne({
      $or: [
        {
          title: { $regex: req.params.title, $options: "i" },
        },
        {
          titleAr: { $regex: req.params.title, $options: "i" },
        },
      ],
      refNumber: req.params.ref,
    }).populate("furnitureStatus");

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Property found, send it as the response
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/relatedProperties/:id", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    const relatedProperties = await Property.find({
      _id: { $ne: propertyId }, // Exclude the current property
      $or: [
        { area: property.area }, // Match properties with the same area
        { areaAr: property.areaAr }, // Match properties with the same Arabic area
      ],
    }).limit(3); // Fetch a maximum of 3 related properties

    res.json(relatedProperties);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get the count of properties for each subarea
app.get("/subarea-count", async (req, res) => {
  try {
    const subareas = await Subarea.find();
    const subareaCountMap = {};

    for (const subarea of subareas) {
      const subareaName = subarea.name;
      const propertyCount = await Property.countDocuments({
        subarea: subareaName,
      });
      subareaCountMap[subareaName] = propertyCount;
    }

    res.status(200).json(subareaCountMap);
  } catch (err) {
    res.status(500).json({ error: "Error fetching property count by subarea" });
  }
});

// Route to update a specific property by ID
app.put("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    );
    property.save();
    if (property) {
      res.send({ message: "Added Successfully" });
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update property" });
  }
});

// Route to update Main Image a specific property by ID
app.put("/mainimage/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          mainimage: {
            image: req.body.image,
            placeholder: req.body.placeholder,
          },
        },
      },
      {
        new: true,
      }
    );
    property.save();
    if (property) {
      res.send({ message: "Main Image Added Successfully" });
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update property" });
  }
});

// Route to renew a specific property by ID
app.put("/renew/:id", async (req, res) => {
  try {
    const highestRenew = await Property.findOne().sort({ renewNumber: -1 });

    const property = await Property.findByIdAndUpdate(req.params.id, {
      renewNumber: highestRenew.renewNumber + 1,
    });
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to renew property" });
  }
});
app.put(
  "/addimages/:id",
  multiFiles("images"),
  addWatermarkNoMain(),
  async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      property.images = [
        ...property.images,
        ...req.files.map((e) => {
          return { image: e.filename, placeholder: e.placeholder };
        }),
      ];
      property.save();
      if (property) {
        res.json({ message: "property images added" });
      } else {
        res.status(404).json({ error: "Property not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to renew property" });
    }
  }
);
// Route to delete a specific property by ID
app.delete("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndRemove(req.params.id);
    if (property) {
      res.json({ message: "Property deleted" });
    } else {
      res.status(404).json({ error: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property" });
  }
});

//by propertType
app.get("/propertyTypes", async (req, res) => {
  try {
    const propertyTypes = await Property.distinct("propertyType");
    res.json(propertyTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch property types" });
  }
});

module.exports = app;
