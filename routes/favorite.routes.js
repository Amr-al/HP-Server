const express = require("express");
const jwt = require("jsonwebtoken");
const Favorite = require("../mongodb/models/favorite");

const app = express.Router();

app.get("/", async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_SECRET || "123456"
        );

        if (decodedToken && decodedToken.userId) {
          const favorites = await Favorite.find({
            userId: decodedToken.userId,
          })
            .sort({ createdAt: "DESC" })
            .populate({
              path: "propertyId",
              populate: [
                { path: "furnitureStatus" },
                { path: "area" },
                { path: "subarea" },
                { path: "propertyType" },
              ],
            });

          res.send({ message: "success", favorites: favorites });
        } else {
          return res.status(500).send({ meassge: "Invalid Token" });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.post("/", async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decodedToken = jwt.verify(
          token,
          process.env.JWT_SECRET || "123456"
        );

        if (decodedToken && decodedToken.userId) {
          const favoritesFromDB = await Favorite.find({
            propertyId: req.body.propertyId,
          });

          if (favoritesFromDB.length > 0) {
            await Favorite.deleteOne({
              propertyId: req.body.propertyId,
            });
          } else {
            const favorite = new Favorite({
              userId: decodedToken?.userId,
              propertyId: req.body.propertyId,
            });
            await favorite.save();
          }

          res.send({ message: "success" });
        } else {
          return res.status(500).send({ meassge: "Invalid Token" });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const favorite = await Favorite.deleteOne({ _id: req.params.id });
    if (favorite) res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

module.exports = app;
