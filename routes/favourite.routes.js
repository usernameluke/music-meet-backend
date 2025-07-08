const express = require("express");
const Favourite = require("../models/Favourite.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();

// GET /api/favourites - get all favourites for the logged-in user
router.get("/", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  Favourite.find({ user: userId })
    .populate("event")
    .then((favourites) => {
      res.json(favourites.map((f) => f.event));
    })
    .catch((err) => next(err));
});

// POST /api/favourites/:eventId - add to favourites
router.post("/:eventId", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  const { eventId } = req.params;

  Favourite.findOne({ user: userId, event: eventId })
    .then((existing) => {
      if (existing) {
        return res.status(409).json({ message: "Already favourited" });
      }

      return Favourite.create({ user: userId, event: eventId }).then((favourite) =>
        res.status(201).json(favourite)
      );
    })
    .catch((err) => next(err));
});

// DELETE /api/favourites/:eventId - remove from favourites
router.delete("/:eventId", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  const { eventId } = req.params;

  Favourite.findOneAndDelete({ user: userId, event: eventId })
    .then(() => res.json({ message: "Removed from favourites" }))
    .catch((err) => next(err));
});

module.exports = router;
