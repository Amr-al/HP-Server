const express = require('express');
const SocialMedia = require('../mongodb/models/socialMedia');
const router = express.Router();

// Route to add social media links
router.post('/', async (req, res) => {
  try {
    const socialMediaData = req.body; // Assuming req.body contains the social media links
    const existingSocialMedia = await SocialMedia.findOne();
    if (existingSocialMedia) {
      // Update existing document
      existingSocialMedia.set(socialMediaData);
      await existingSocialMedia.save();
      res
        .status(200)
        .json({ message: 'Social media links updated successfully' });
    } else {
      // Create new document
      const newSocialMedia = new SocialMedia(socialMediaData);
      await newSocialMedia.save();
      res
        .status(201)
        .json({ message: 'Social media links added successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update social media links
router.put('/', async (req, res) => {
  try {
    const socialMediaData = req.body; // Assuming req.body contains the updated social media links
    const existingSocialMedia = await SocialMedia.findOne();
    if (existingSocialMedia) {
      existingSocialMedia.set(socialMediaData);
      await existingSocialMedia.save();
      res
        .status(200)
        .json({ message: 'Social media links updated successfully' });
    } else {
      res.status(404).json({ error: 'Social media links not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get social media links
router.get('/', async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findOne().select(`-__v -_id`);
    if (socialMedia) {
      res.status(200).json(socialMedia);
    } else {
      res.status(404).json({ error: 'Social media links not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
