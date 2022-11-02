const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const User = require('../models/User')
const Credit = require('../models/Credit')

exports.addCredit = async (req, res) => {
  const { idNumber, amount } = req.body

  if (!amount) {
    throw new CustomError.BadRequestError('Please provide amount')
  }

  const user = await User.findOne({ idNumber })
  let credit = await Credit.findOne({ userId: user._id })

  if (credit) {
    credit.amount = credit.amount + amount
    await credit.save()
  } else {
    credit = await Credit.create({ userId: user._id, amount })
  }

  res.status(StatusCodes.OK).json(credit)
}

exports.getCreditBalance = async (req, res) => {
  const { userId } = req.params
  if (!userId) {
    throw new CustomError.BadRequestError('Please provide user id')
  }

  const credit = await Credit.findOne({ userId })

  if (!credit) {
    res.status(StatusCodes.OK).json({ userId: userId, balance: 0 })
  } else {
    res
      .status(StatusCodes.OK)
      .json({ userId: credit.userId, balance: credit.amount })
  }
}
