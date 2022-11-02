const mongoose = require('mongoose')

const creditSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      // trim: true,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Credit', creditSchema)
