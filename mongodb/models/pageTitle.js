const mongoose = require("mongoose");
const { Schema } = mongoose;

const pageTitleSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    linkAr: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pageTitle", pageTitleSchema);
