const express = require('express')
const router = express.Router()

const {
  ManagerObs
} = require('../controllers/managerController')

router.route('/register').post(ManagerObs.managerRegister)
router.route('/login').post(ManagerObs.managerLogin)
router.route('/:id').delete(ManagerObs.deleteManager)

module.exports = router
