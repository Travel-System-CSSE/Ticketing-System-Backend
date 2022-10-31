const express = require('express')
const router = express.Router()

const { addroute,getroutes,removeroute,getoneroute } = require('../controllers/routesmanageController')

//routes
router.route('/addroute').post(addroute)
router.route('/getroutes').get(getroutes) 
router.route('/getoneroute').get(getoneroute) 
router.route('/delroute').post(removeroute)


module.exports = router
