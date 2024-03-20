const mongoose = require("mongoose");// import autopopulate from "mongoose-autopopulate";
const { Schema } = mongoose;

const currencySchema = Schema({
  USD: {
    type: Number,
    required: true,
  },
  EUR: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Currency", currencySchema);
