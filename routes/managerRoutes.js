const express = require('express')
const router = express.Router()

const {
  managerLogin,
  managerRegister,
} = require('../controllers/managerController')

router.route('/register').post(managerRegister)
router.route('/login').post(managerLogin)

module.exports = router
