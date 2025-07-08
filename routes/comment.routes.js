const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Comment = require("../models/Comment.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET /api/comments/user - Get all comments created by the logged-in user
router.get("/user", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  Comment.find({ author: userId })
    .populate("post", "title") // include post title (optional)
    .sort({ createdAt: -1 })
    .then((userComments) => res.json(userComments))
    .catch((err) => next(err));
});

// Get all comments for a specific post
router.get("/:postId", (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  Comment.find({ post: postId })
    .populate("author", "name") // populate author's username
    .sort({ createdAt: -1 })
    .then((comments) => res.json(comments))
    .catch((err) => next(err));
});

// Create a comment (user must be authenticated)
router.post("/", isAuthenticated, (req, res, next) => {
  const { post, text } = req.body;
  const author = req.payload._id; // from JWT middleware

  if (!text || !post) {
    return res.status(400).json({ message: "Post and text are required" });
  }

  Comment.create({ post, author, text })
    .then((newComment) => res.status(201).json(newComment))
    .catch((err) => next(err));
});

// Delete a comment by ID (optional - only by author or admin ideally)
router.delete("/:commentId", isAuthenticated, (req, res, next) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: "Invalid comment ID" });
  }

  Comment.findByIdAndDelete(commentId)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

module.exports = router;
