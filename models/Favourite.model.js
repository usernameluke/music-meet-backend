const { Schema, model } = require("mongoose");

const favouriteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "eventPost", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Optional: prevent duplicates (many-to-many constraint)
favouriteSchema.index({ user: 1, event: 1 }, { unique: true });

const Favourite = model("Favourite", favouriteSchema);

module.exports = Favourite;
