const mongoose = require("mongoose");// import autopopulate from "mongoose-autopopulate";
const { Schema } = mongoose;

const areaSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Property",
  },
  subareas: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subarea",
    },
  ],
});
// areaSchema.plugin(autopopulate);

module.exports = mongoose.model("Area", areaSchema);
