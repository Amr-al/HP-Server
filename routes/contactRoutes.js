const express = require('express');
const Contact = require('../mongodb/models/contact');
const sendEmail = require('../utils/emailSender.js');
const propertyInquiry = require('../templates/propertyInquiry.js');
const Property = require('../mongodb/models/property');
const propertyRequest = require('../templates/propertyRequest.js');
const router = express.Router();

// Define a route for form submission
router.post('/submit', async (req, res) => {
  const { name, mobile, email, message, propertyRef } = req.body;

  try {
    const contact = new Contact({ name, mobile, email, message });
    await contact.save();

    const property = await Property.findOne({ refNumber: propertyRef }).populate("furnitureStatus").populate("area").populate("subarea").populate("propertyType");
    // sendEmail(email, "Inquiry", propertyInquiry(property.title, property.images[0], property.refNumber, property.beds, property.baths, property.propertyArea, property.price, name))
    let url = "https://housepointegypt.com/" + property.type + "/" + property.propertyType.name + "/" + property.area.name + "/" + property.subarea.name + "/" + property.title + "-" + property.refNumber
    url.toLowerCase().split(" ").join("-")
    sendEmail(process.env.EMAILUSER, email, "Request", propertyRequest(property.title, process.env.PROPERTY_BASE_URL + "/" +property.images[0].image, property.refNumber, property.beds, property.baths, property.propertyArea, property.price, name, message, mobile, email, url))
    res.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;