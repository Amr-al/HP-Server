const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = Schema({
  name: {
    type: String,
  },
  // nameAr: {
  //   type: String,
  // },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  // messageAr: {
  //   type: String,
  // },
});

module.exports = mongoose.model('Contact', contactSchema);
