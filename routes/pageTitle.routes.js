const express = require("express");
const PageTitle = require("../mongodb/models/pageTitle");

const app = express.Router();

app.get("/", async (req, res) => {
  try {
    const pageTitle = await PageTitle.find().sort({ createdAt: "DESC" });
    res.send({ message: "success", titles: pageTitle });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.get("/single", async (req, res) => {
  try {
    let pageTitle = [];
    if (req.headers["accept-language"] === "ar") {
      pageTitle = await PageTitle.find({ linkAr: req.query.link }).sort({
        order: "ASC",
      });
    } else {
      pageTitle = await PageTitle.find({ link: req.query.link }).sort({
        order: "ASC",
      });
    }
    res.send({ message: "success", pageTitle });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const { link, linkAr, title, titleAr, order } = req.body;
    const pageTitle = new PageTitle({
      link,
      linkAr,
      title,
      titleAr,
      order,
    });
    await pageTitle.save();
    res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.patch("/:id", async (req, res) => {
  try {
    const pageTitle = await PageTitle.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (pageTitle) await pageTitle.save();
    res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const pageTitle = await PageTitle.deleteOne({ _id: req.params.id });
    if (pageTitle) res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = app;
