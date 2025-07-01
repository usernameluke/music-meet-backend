const express = require("express");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();

// PUT /users/profile - update own profile
router.put("/profile", isAuthenticated, (req, res) => {
  const userId = req.payload._id;
  const updateData = req.body;

  // Allowed fields you specified:
  const allowedFields = [
    "bio",
    "socialLinks",
    "instruments",
    "genres",
    "experienceLevel",
    "inBand",
    "lookingFor",
    "availability",
    "bandName",
    "members",
    "bandGenres",
    "bandLookingFor",
    "venueName",
    "address",
    "capacity",
    "website",
  ];

  // Filter the updateData to only include allowed fields
  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  User.findByIdAndUpdate(userId, filteredData, { new: true })
    .select("-password")
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error("Error updating user profile:", err);
      res.status(500).json({ message: err.message });
    });
});

router.get("/profile", isAuthenticated, (req, res) => {
  const { _id } = req.payload;

  User.findById(_id)
    .then((foundProfileInfo) => {
      res.json(foundProfileInfo);
    })
    .catch((err) => {
      console.error("Error finding user profile info:", err);
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
