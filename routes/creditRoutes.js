const express = require('express')
const router = express.Router()
const {
  addCredit,
  getCreditBalance,
  deleteCredit,
  getCreditBalanceByIDNo,
} = require('../controllers/creditController')

router.route('/').post(addCredit)
router.route('/:userId').get(getCreditBalance)
router.route('/:id').delete(deleteCredit)
router.route('/getBal/:idNumber').get(getCreditBalanceByIDNo)

module.exports = router
