const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createTokenUser, createJWT } = require('../utils')

//! REGISTER CONTROLLER
const register = async (req, res) => {
  const { name, idNumber, password, role } = req.body

  if (!name || !idNumber || !password || !role) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  const userAlreadyExists = await User.findOne({ idNumber })
  if (userAlreadyExists) {
    throw new CustomError.BadRequestError('User already exists')
  }

  const user = await User.create({ name, idNumber, password, role })

  const tokenUser = createTokenUser(user)
  const token = createJWT({ payload: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token })
}

//! LOGIN CONTROLLER
const login = async (req, res) => {
  const { idNumber, password } = req.body
  if (!idNumber || !password) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  const user = await User.findOne({ idNumber })
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
