const Manager = require('../models/Manager')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createJWT } = require('../utils')
const CommonConstants = require('../CommonConstants')

var ManagerObs = {}
/**
 * Controller for the user type manager managment
 * observer pattern
 */
;(function (container) {
  container.managerRegister = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new CustomError.BadRequestError(CommonConstants.EMPTY_FIELDS)
    }

    const isManagerExists = await Manager.findOne({ email })
    if (isManagerExists) {
      throw new CustomError.BadRequestError(CommonConstants.USER_ALREADY_EXISTS)
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
  container.managerLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      throw new CustomError.BadRequestError(CommonConstants.EMPTY_FIELDS)
    }

    const manager = await Manager.findOne({ email })
    if (!manager) {
      throw new CustomError.UnauthenticatedError(
        CommonConstants.INVALID_CREDENTIALS
      )
    }

    const isPasswordCorrect = await manager.comparePassword(password)
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError(
        CommonConstants.INVALID_CREDENTIALS
      )
    }

    const tokenUser = {
      userId: manager._id,
      name: manager.name,
      email: manager.email,
    }
    const token = createJWT({ payload: tokenUser })
    res.status(StatusCodes.OK).json({ user: tokenUser, token })
  }
  container.deleteManager = async (req, res) => {
    const user = await Manager.findOne({ _id: req.params.id }).select(
      '-password'
    )
    if (!user) {
      throw new CustomError.NotFoundError(
        CommonConstants.USER_NOT_FOUND + req.params.id
      )
    }
    await user.remove()
    res
      .status(StatusCodes.OK)
      .json({ msg: CommonConstants.SUCCESSFULL_USER_DELETE })
  }
})(ManagerObs)

module.exports = { ManagerObs }
