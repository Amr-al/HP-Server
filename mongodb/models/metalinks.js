const mongoose = require("mongoose");// import autopopulate from "mongoose-autopopulate";
const { Schema } = mongoose;

const metalinksSchema = Schema({
  link: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  keywords: {
    type: String,
    required: true,
  }

});
// areaSchema.plugin(autopopulate);

module.exports = mongoose.model("MetaLinks", metalinksSchema);
