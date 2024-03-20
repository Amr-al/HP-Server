const express = require('express');
const FooterLink = require('../mongodb/models/footerLink');
const app = express.Router();

// Create a new footer link
app.post('/', async (req, res) => {
  try {
    const { title, titleAr, link, linkAr, order } = req.body;
    const footerLink = new FooterLink({ title, titleAr, link, linkAr, order });
    await footerLink.save();
    res.json(footerLink);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create footer link' });
  }
});

// Get all footer links
app.get('/', async (req, res) => {
  try {
    const footerLinks = await FooterLink.find();
    res.json(footerLinks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve footer links' });
  }
});

// Get a specific footer link by ID
app.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const footerLink = await FooterLink.findById(id);
    if (!footerLink) {
      res.status(404).json({ error: 'Footer link not found' });
    } else {
      res.json(footerLink);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve footer link' });
  }
});

// Update a specific footer link by ID
app.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, titleAr, link, linkAr, order } = req.body;
    const updatedFooterLink = await FooterLink.findByIdAndUpdate(
      id,
      { title, titleAr, link, linkAr, order },
      { new: true }
    );
    if (!updatedFooterLink) {
      res.status(404).json({ error: 'Footer link not found' });
    } else {
      res.json(updatedFooterLink);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update footer link' });
  }
});

// Delete a specific footer link by ID
app.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFooterLink = await FooterLink.findByIdAndRemove(id);
    if (!deletedFooterLink) {
      res.status(404).json({ error: 'Footer link not found' });
    } else {
      res.json(deletedFooterLink);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete footer link' });
  }
});

module.exports = app;