const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  attachments: { type: String }, // file path (e.g., "/uploads/file.mp3")
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Message = model("Message", messageSchema);

module.exports = Message;
