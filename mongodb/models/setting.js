const mongoose = require("mongoose");
const { Schema } = mongoose;

const settingSchema = Schema({
  arabicTitle: {
    type: String,
  },
  arabicDescription: {
    type: String,
  },
  arabicKeywords: {
    type: String,
  },
  arabicTag: {
    type: String,
  },
  englishTitle: {
    type: String,
  },
  englishDescription: {
    type: String,
  },
  englishKeywords: {
    type: String,
  },
  englishTag: {
    type: String,
  },
  homeOGTitleAR: {
    type: String,
  },
  homeOGTitleEN: {
    type: String,
  },
  homeOGImageURL: {
    type: String,
  },
  homeOGURLWebsite: {
    type: String,
  },
  homeOGImageALTAR: {
    type: String,
  },
  homeOGImageALTEN: {
    type: String,
  },
  homeOGSiteNameAR: {
    type: String,
  },
  homeOGSiteNameEN: {
    type: String,
  },
  twitterTitleAR: {
    type: String,
  },
  twitterTitleEN: {
    type: String,
  },
  twitterDescriptionAR: {
    type: String,
  },
  twitterDescriptionEN: {
    type: String,
  },
  twitterCardAccount: {
    type: String,
  },
  twitterDomain: {
    type: String,
  },
  address: {
    type: String,
  },
  phones: {
    type: [String],
  },
  emails: {
    type: [String],
  },
  arabicAddress: {
    type: String,
  },
  aboutUs: {
    type: String,
  },
  aboutUsAr: {
    type: String,
  },

  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  twitter: {
    type: String,
  },
  youtube: {
    type: String,
  },
  linkedin: {
    type: String,
  },
});

module.exports = mongoose.model("Setting", settingSchema);
