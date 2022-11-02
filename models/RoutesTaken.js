const mongoose = require("mongoose");

const RoutesTakenSchema = new mongoose.Schema(
  {
    RouteID: {
      type: mongoose.Types.ObjectId,
      ref: "Route",
      required: [true, "Please provide Route id"],
    },
    UserDetails: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide Userid"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RouteTakens", RoutesTakenSchema);
