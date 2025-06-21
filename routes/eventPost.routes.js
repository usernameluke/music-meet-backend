const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Event = require("../models/EventPost.model");

const fileUploader = require("../config/cloudinary.js");

// POST /api/events - Create a new event
router.post("/", isAuthenticated, fileUploader.single("imageUrl"), (req, res, next) => {
  const {
    title,
    description,
    location,
    eventDate,
    eventTime,
    compensation,
    type,
    instrumentsNeeded,
    genres,
  } = req.body;

  const author = req.payload._id;

  const imageUrl = req.file?.path || "";

  Event.create({
    author,
    title,
    description,
    location,
    imageUrl,
    eventDate,
    eventTime,
    compensation,
    type,
    instrumentsNeeded,
    genres,
  })
    .then((response) => res.json(response))
    .catch((err) => res.status(500).json(err));
});

// GET /api/events - Retrieves all events
router.get("/", (req, res, next) => {
  Event.find()
    .sort({ createdAt: -1 })
    .then((allEvents) => res.json(allEvents))
    .catch((err) => res.status(500).json(err));
});

// GET /api/events/:eventId - Retrieves specific event
router.get("/:eventId", (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Specified ID is not valid" });
  }

  Event.findById(eventId)
    .populate("author", "username")
    .then((event) => res.status(200).json(event))
    .catch((error) => res.status(500).json(error));
});

// PUT /api/events/:eventId - Update event (auth protected)
router.put("/:eventId", isAuthenticated, async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.payload._id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Specified ID is not valid" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE /api/events/:eventId - Delete event (auth protected)
router.delete("/:eventId", isAuthenticated, async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.payload._id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Specified ID is not valid" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: `Event with ID ${eventId} has been deleted.` });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
