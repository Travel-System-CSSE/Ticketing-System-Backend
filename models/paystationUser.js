const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const paystationUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide name'],
      minlength: [3, 'mininmum lenght is 3'],
      maxlength: [30, 'maximum length is 30'],
    },
    employeeID: {
      type: String,
      trim: true,
      required: [true, 'Please provide employee ID'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
    },
  },
  { timestamps: true }
)

paystationUserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

paystationUserSchema.methods.comparePassword = async function (
  candidatePassword
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('PaystationUser', paystationUserSchema)
