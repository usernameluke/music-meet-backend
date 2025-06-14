const { Schema, model } = require("mongoose");


const eventPostSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
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
  eventDate: Date,
  compensation: {
    type: String,
    required: [true, "Need compensation information."],
  }, // "€100 + drinks" or "Unpaid jam sesh"
  type: {
    type: String,
    enum: ["Jam Session", "Band Try Outs", "Collab", "Gig", "Fest"],
    default: "Jam Session"
  },
  instrumentsNeeded: [String],
  genres: [String],

  createdAt: { type: Date, default: Date.now }
});

const eventPost = model("eventPost", eventPostSchema);

module.exports = eventPost;
