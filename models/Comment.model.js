const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "eventPost" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: {
    type: String,
    required: [true, "Need some text."],
  },
  createdAt: { type: Date, default: Date.now },
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
