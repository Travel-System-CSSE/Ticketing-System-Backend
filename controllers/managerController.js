const Manager = require('../models/Manager')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createJWT } = require('../utils')

//! MANAGER REGISTER CONTROLLER
const managerRegister = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  const isManagerExists = await Manager.findOne({ email })
  if (isManagerExists) {
    throw new CustomError.BadRequestError('User already exists')
  }

  const manager = await Manager.create({ name, email, password })

  const tokenUser = {
    userId: manager._id,
    name: manager.name,
    email: manager.email,
  }
  const token = createJWT({ payload: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token })
}

//! MANAGER LOGIN CONTROLLER
const managerLogin = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide all values')
  }

  const manager = await Manager.findOne({ email })
  if (!manager) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }

  const isPasswordCorrect = await manager.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }

  const tokenUser = {
    userId: manager._id,
    name: manager.name,
    email: manager.email,
  }
  const token = createJWT({ payload: tokenUser })
  res.status(StatusCodes.OK).json({ user: tokenUser, token })
}

module.exports = { managerRegister, managerLogin }
