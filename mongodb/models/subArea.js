const mongoose = require("mongoose"); const { Schema } = mongoose;

const subareaSchema = Schema({
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
  area: {
    type: Schema.Types.ObjectId,
    ref: "Area",
    required: true,
  },
});

module.exports = mongoose.model("Subarea", subareaSchema);
