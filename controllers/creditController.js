const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const User = require('../models/User')
const Credit = require('../models/Credit')

exports.createCredit = async (req, res, next) => {
  try {
    const credit = await Credit.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        credit,
      },
    })
  } catch (error) {
    res.json({
      status: 'fail',
      result: error,
    })
  }
}

exports.getCredit = async (req, res) => {
  try {
    const { id } = req.params
    const documents = await Credit.find({ userId: id })
    res.status(200).json({
      status: 'success',
      documents,
    })
  } catch (error) {
    res.json({
      status: 'fail',
      result: error,
    })
  }
}

exports.addCredit = async (req, res) => {
  const { idNumber, amount } = req.body

  if (!amount) {
    throw new CustomError.BadRequestError('Please provide amount')
  }

  const user = await User.findOne({ idNumber })

  var credit = await Credit.findOne({ userId: user._id })

  if (credit) {
    credit.amount = credit.amount + amount
    await credit.save()
  } else {
    credit = await Credit.create({ userId: user._id, amount })
  }

  res.status(StatusCodes.OK).json({ credit })
}

exports.getUser = async (req, res) => {
  const { idNumber } = req.body

  if (!idNumber) {
    throw new CustomError.BadRequestError('Please provide ID Number')
  }

  const user = await User.findOne({ idNumber })

  if (!user) {
    throw new CustomError.UnauthenticatedError(
      'No user found for this ID Number'
    )
  }
  res.status(StatusCodes.OK).json({ user })
}
