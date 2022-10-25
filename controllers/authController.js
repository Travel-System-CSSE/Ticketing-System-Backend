const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createTokenUser, createJWT, generateQR } = require('../utils')

//! REGISTER CONTROLLER
const register = async (req, res) => {
  const { name, nationalID, passportNumber, password, role } = req.body

  if (!name || !(nationalID || passportNumber) || !password || !role) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  let userAlreadyExists = false
  if (nationalID) {
    userAlreadyExists = await User.findOne({ nationalID })
  } else {
    userAlreadyExists = await User.findOne({ passportNumber })
  }

  if (userAlreadyExists) {
    throw new CustomError.BadRequestError('User already exists')
  }

  const qrCode = await generateQR(name, nationalID, passportNumber, role)
  const user = await User.create(
    Object.assign(
      { name, password, role, qrCode },
      nationalID && { nationalID },
      passportNumber && { passportNumber }
    )
  )

  const tokenUser = createTokenUser(user)
  const token = createJWT({ payload: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token })
}

//! LOGIN CONTROLLER
const login = async (req, res) => {
  const { nationalID, passportNumber, password } = req.body
  if (!(nationalID || passportNumber) || !password) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  let user = null
  if (nationalID) {
    user = await User.findOne({ nationalID })
  } else {
    user = await User.findOne({ passportNumber })
  }

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }

  const tokenUser = createTokenUser(user)
  const token = createJWT({ payload: tokenUser })
  res.status(StatusCodes.OK).json({ user: tokenUser, token })
}

module.exports = { login, register }
