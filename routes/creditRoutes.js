const express = require('express')
const router = express.Router()
const {
  addCredit,
  getCreditBalance,
  deleteCredit
} = require('../controllers/creditController')

router.route('/').post(addCredit)
router.route('/:userId').get(getCreditBalance)
router.route("/:id").delete(deleteCredit);

module.exports = router
