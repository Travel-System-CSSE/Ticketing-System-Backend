const express = require('express')
const router = express.Router()
const {
  addCredit,
  getCreditBalance,
} = require('../controllers/creditController')

router.route('/').post(addCredit)
router.route('/:userId').get(getCreditBalance)

module.exports = router
