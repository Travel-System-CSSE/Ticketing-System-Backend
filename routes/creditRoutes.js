const express = require('express')
const router = express.Router()
const {
  addCredit,
  getCreditBalance,
  deleteCredit
} = require('../controllers/creditController')

//route for add credit
router.route('/').post(addCredit)
//route for get credit
router.route('/:userId').get(getCreditBalance)
////route for delete credit
router.route("/:id").delete(deleteCredit);

module.exports = router
