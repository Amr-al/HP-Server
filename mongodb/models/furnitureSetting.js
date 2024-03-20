const mongoose = require("mongoose");// import autopopulate from "mongoose-autopopulate";
const { Schema } = mongoose;

const furnitureSettingSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});
// furnitureSettingSchema.plugin(autopopulate);

module.exports = mongoose.model("furnitureSetting", furnitureSettingSchema);
