const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const eventPostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  title: {
    type: String,
    required: [true, "Need a title."],
  },
  description: {
    type: String,
    required: [true, "Need a description."]
  },
  location: {
    type: String,
    required: [true, "Need a location."],
  },
  imageUrl: {
    type: String,
    required: false
  },
  eventDate: Date,
  eventTime: String,
  compensation: {
    type: String,
    required: [true, "Need compensation information."],
  }, // "€100 + drinks" or "Unpaid jam sesh"
  type: {
    type: String,
    enum: ["Jam Session", "Band Try Outs", "Collab", "Gig", "Fest"],
    default: "Jam Session"
  },
  instrumentsNeeded: String,
  genres: String,
  accomodation: Boolean,

  createdAt: { type: Date, default: Date.now }
});

const eventPost = mongoose.models.eventPost || model("eventPost", eventPostSchema);

module.exports = eventPost;
