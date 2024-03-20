const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobiles: [String],
    emails: {
      type: [String],
      required: true,
      unique: true,
    },
    company: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Add timestamps for createdAt and updatedAt
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
