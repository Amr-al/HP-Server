const mongoose = require("mongoose");// import autopopulate from "mongoose-autopopulate";
const { Schema } = mongoose;

const propertyTypeSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
  name2: {
    type: String,
    required: true,
  },
  nameAr2: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});


// propertyTypeSchema.plugin(autopopulate);

module.exports = mongoose.model("propertyType", propertyTypeSchema);
