const express = require('express')
const router = express.Router()

const {
  managerLogin,
  managerRegister,
  deleteManager
} = require('../controllers/managerController')

router.route('/register').post(managerRegister)
router.route('/login').post(managerLogin)
router.route('/:id').delete(deleteManager)

module.exports = router
