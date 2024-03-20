const mongoose = require("mongoose"); // import autopopulate from "mongoose-autopopulate";
const { Schema } = mongoose;

const aboutusSchema = Schema({
  description: {
    type: String,
    required: true,
  },
  descriptionAr: {
    type: String,
    required: true,
  },
});
// areaSchema.plugin(autopopulate);

module.exports = mongoose.model("Aboutus", aboutusSchema);
