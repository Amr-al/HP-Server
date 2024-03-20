const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  firstName: { type: String, },
  lastName: { type: String, },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
});

module.exports = mongoose.model("User", userSchema);
