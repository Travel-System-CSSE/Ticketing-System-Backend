const mongoose = require('mongoose')

const creditSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Credit', creditSchema)
