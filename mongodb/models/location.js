const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Property",
  },
});


module.exports = mongoose.model("Location", locationSchema);
