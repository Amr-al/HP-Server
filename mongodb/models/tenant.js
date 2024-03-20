const mongoose = require("mongoose");// import autopopulate from "mongoose-autopopulate";
const { Schema } = mongoose;

const tenantSchema = Schema({
  ownerName: {
    type: String,
    required: true,

  },
  ownerPhone: {
    type: String,
    required: true,

  },
  tenantName: {
    type: String,
    required: true,

  },
  tenantPhone: {
    type: String,
    required: true,

  },
  propertyType: {
    type: mongoose.Schema.Types.String,
    ref: "propertyType",
    required: true,
  },
  address: {
    type: String,
    required: true,

  },
  expiry: {
    type: Date
  },
  email: {
    type: String,
    required: true,
  },
  rentalValue: {
    type: Number,
  },
  rentalDate: {
    type: Date,
  },
  IDImage: {
    type: String,
  },
  passportImage: {
    type: String,
  },
  contractImage: {
    type: String,
  }

});
// areaSchema.plugin(autopopulate);

module.exports = mongoose.model("Tenant", tenantSchema);
