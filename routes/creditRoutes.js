const express = require('express')
const router = express.Router()
const {
  createCredit,
  getCredit,
  addCredit,
  getUser,
} = require('../controllers/creditController')

router.route('/:id').get(getCredit)
router.route('/').post(createCredit)
router.route('/addCredit').post(addCredit)
router.route('/getUser').get(getUser)

module.exports = router
