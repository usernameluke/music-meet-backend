const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  attachments: [String], //links to an audio file, pdf, or something else
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Message = model("Message", messageSchema);

module.exports = Message;
