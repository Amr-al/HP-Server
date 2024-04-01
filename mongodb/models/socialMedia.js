const mongoose = require('mongoose');
const { Schema } = mongoose;

const socialMediaSchema = Schema({
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  youtube: {
    type: String,
  },
  whatsapp: {
    type: String,
  },
  telegram: {
    type: String,
  },
  snapchat: {
    type: String,
  },
  pinterest: {
    type: String,
  },
  tiktok: {
    type: String,
  },
  reddit: {
    type: String,
  },
  tumblr: {
    type: String,
  },
  medium: {
    type: String,
  },
  discord: {
    type: String,
  },
  skype: {
    type: String,
  },
  viber: {
    type: String,
  },
  signal: {
    type: String,
  },
  twitch: {
    type: String,
  },
  slack: {
    type: String,
  },
  zoom: {
    type: String,
  },
  clubhouse: {
    type: String,
  },
  snapchat: {
    type: String,
  },
  pinterest: {
    type: String,
  },
  tiktok: {
    type: String,
  },
  reddit: {
    type: String,
  },
  tumblr: {
    type: String,
  },
  medium: {
    type: String,
  },
  discord: {
    type: String,
  },
  skype: {
    type: String,
  },
  viber: {
    type: String,
  },
  signal: {
    type: String,
  },
  twitch: {
    type: String,
  },
  slack: {
    type: String,
  },
  zoom: {
    type: String,
  },
  clubhouse: {
    type: String,
  },
});

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
