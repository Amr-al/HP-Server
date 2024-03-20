const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    blogText: {
      type: String,
      required: true,
    },
    keywords: {
      type: String,
      required: true,
    },
    writter: {
      type: String,
    },
    readTime: {
      type: String,
    },
    tag: {
      type: String,
    },
    topic: {
      type: String,
    },
    lang: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Add timestamp fields (createdAt, updatedAt) to the schema
  }
);

module.exports = mongoose.model("Blog", blogSchema);
