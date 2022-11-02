const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../middleware/authentication')

const {
  getUser,
  updateUserPassword,
  deleteUser,
} = require('../controllers/userController')

router
  .route('/:id')
  .get(authenticateUser, getUser)
  .delete(authenticateUser, deleteUser)

router.route('/update-password').put(authenticateUser, updateUserPassword)

module.exports = router
