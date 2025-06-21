const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
  //For all user types
  role: {
    type: String,
    required: [true, "Role is required."],
    enum: ["musician", "band", "venue"],
    default: "musician",
  },
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  location: {
    type: String,
    required: [true, "Location is required."],
  },
  bio: {
    type: String
  },
  socialLinks: {
    instagram: String,
    youtube: String,
    website: String,
  },

  //For musicians
  instruments: [String],
  genres: [String],
  experienceLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  inBand: Boolean,
  lookingFor: [String], // e.g. ['Jam Session', 'Band', 'Collab']
  availability: [String], // e.g. ['Weekends', 'Evenings'],

  // For bands
  bandName: String,
  members: [{ type: Schema.Types.ObjectId, ref: "User" }], // linked musician accounts
  bandGenres: [String],
  bandLookingFor: [String], // e.g. ['Guitarist', 'Drummer']

  // For venues
  venueName: String,
  address: String,
  capacity: Number,
  website: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema);

module.exports = User;
