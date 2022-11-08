const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const User = require('../models/User')
const Credit = require('../models/Credit')

//add credit controller
exports.addCredit = async (req, res) => {
  const { idNumber, amount } = req.body

  if (!amount) {
    throw new CustomError.BadRequestError('Please provide amount')
  }

  const user = await User.findOne({ idNumber })

  if (!user) {
    throw new CustomError.BadRequestError('No user found for the ID number')
  }
  let credit = await Credit.findOne({ userId: user._id })

  if (credit) {
    credit.amount = credit.amount + amount
    await credit.save()
  } else {
    credit = await Credit.create({ userId: user._id, amount })
  }

  res.status(StatusCodes.OK).json(credit)
}

//get credit balance controller
exports.getCreditBalance = async (req, res) => {
  const { userId } = req.params
  if (!userId) {
    throw new CustomError.BadRequestError('Please provide user ID')
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

// get credit balance by ID number controller
exports.getCreditBalanceByIDNo = async (req, res) => {
  const { idNumber } = req.params
  if (!idNumber) {
    throw new CustomError.BadRequestError('Please provide ID number')
  }

  const user = await User.findOne({ idNumber })

  if (!user) {
    throw new CustomError.NotFoundError('No user found for the ID number')
  }

  const credit = await Credit.findOne({ userId: user._id })

  if (!credit) {
    res.status(StatusCodes.OK).json({ user, balance: 0 })
  } else {
    res.status(StatusCodes.OK).json({ user, balance: credit.amount })
  }
}

//delete credit controller
exports.deleteCredit = async (req, res) => {
  const credit = await Credit.findOne({ _id: req.params.id })
  if (!credit) {
    throw new CustomError.NotFoundError(
      `No credit found for this user with id : ${req.params.id}`
    )
  }
  await Credit.deleteOne({ _id: req.params.id })
  res.status(StatusCodes.OK).json({ msg: 'Success! Credit Deleted.' })
}
