const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const routeSchema = new mongoose.Schema(
  {
    Routename: {
      type: String,
    },
    bus: {
      type: String,
    },
    startpoint: {
      type: String,
    },
    stops: {
      type: Array,
    },
    starttime: {
      type: String,
    },
    endtime: {
        type: String,
    },
    totdistance: {
        type: Number,
    },
    addedby: {
        type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Route", routeSchema);
