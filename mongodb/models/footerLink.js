const mongoose = require("mongoose"); const { Schema } = mongoose;

const footerLinkSchema = Schema({
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
});

module.exports = mongoose.model("FooterLink", footerLinkSchema);
