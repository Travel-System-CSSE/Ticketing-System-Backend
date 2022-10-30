const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Credit", creditSchema);
