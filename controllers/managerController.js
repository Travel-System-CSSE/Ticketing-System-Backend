const Manager = require('../models/Manager')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createJWT } = require('../utils')

var ManagerObs = {};
/**
 * Controller for the user type manager managment
 * observer pattern
 */ 
(function (container){
  container.managerRegister = async (req, res) => {
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
  container.managerLogin = async (req, res) => {
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
  container.deleteManager = async (req, res) => {
    const user = await Manager.findOne({ _id: req.params.id }).select('-password')
    if (!user) {
      throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`)
    }
    await user.remove()
    res.status(StatusCodes.OK).json({ msg: 'Success! User Deleted.' })
  }
})(ManagerObs)
  //! MANAGER REGISTER CONTROLLER
 

module.exports = { ManagerObs }
