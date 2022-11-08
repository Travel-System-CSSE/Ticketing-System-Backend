const express = require('express')
const router = express.Router()
const {
  addCredit,
  getCreditBalance,
  deleteCredit,
  getCreditBalanceByIDNo,
} = require('../controllers/creditController')

//add credit route
router.route('/').post(addCredit)

//get credit balance route
router.route('/:userId').get(getCreditBalance)

//delete credit route
router.route('/:id').delete(deleteCredit)

//get credit balance by ID number route
router.route('/getBal/:idNumber').get(getCreditBalanceByIDNo)

module.exports = router
