const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "eventPost" },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  text: {
    type: String,
    required: [true, "Need some text."],
  },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.models.Comment || model("Comment", commentSchema);

module.exports = Comment;
