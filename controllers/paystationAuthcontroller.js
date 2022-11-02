const paystationUser = require('../models/paystationUser')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createTokenUser, createJWT } = require('../utils')

//! REGISTER CONTROLLER
const register = async (req, res) => {
  const { name, employeeID, password } = req.body

  if (!name || !employeeID || !password) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  const userAlreadyExists = await paystationUser.findOne({ employeeID })
  if (userAlreadyExists) {
    throw new CustomError.BadRequestError('User already exists')
  }

  const user = await paystationUser.create({ name, employeeID, password })

  const tokenUser = createTokenUser(user)
  const token = createJWT({ payload: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token })
}

//! LOGIN CONTROLLER
const login = async (req, res) => {
  const { employeeID, password } = req.body
  if (!employeeID || !password) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  const user = await paystationUser.findOne({ employeeID })
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

module.exports = { register, login }
