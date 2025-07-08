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
    "instagram",
    "youtube",
    "website",
    "instruments",
    "genres",
    "experienceLevel",
    "inBand",
    "lookingFor",
    "availability",
    "members",
    "bandGenres",
    "bandLookingFor",
    "address",
    "pay",
    "lodging",
    "capacity"
  ];

  // Filter the updateData to only include allowed fields
  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  User.findByIdAndUpdate(userId, filteredData, { new: true })
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

// GET /users?role=musician - Get all users filtered by role (e.g., musician)
router.get("/", isAuthenticated, (req, res) => {
  const { role } = req.query;

  const filter = role ? { role } : {};

  User.find(filter)
    .then((users) => res.json(users))
    .catch((err) => {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Error fetching users", error: err });
    });
});

// GET /users/:id - Get public profile info of any user (excluding private fields)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-email -password" // Exclude sensitive fields
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching public user profile:", err);
    res.status(500).json({ message: "Failed to get public profile" });
  }
});


router.delete("/profile", isAuthenticated, (req, res) => {
  const { _id } = req.payload;

  User.findByIdAndDelete(_id)
    .then(() => {
      res.json({ message: "Profile has been deleted" });
    })
    .catch((err) => {
      console.error("Error finding user profile info:", err);
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
