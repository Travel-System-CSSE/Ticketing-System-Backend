const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide name'],
      minlength: [3, 'mininmum lenght is 3'],
      maxlength: [30, 'maximum length is 30'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide email'],
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  { timestamps: true }
)

managerSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

managerSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('Manager', managerSchema)