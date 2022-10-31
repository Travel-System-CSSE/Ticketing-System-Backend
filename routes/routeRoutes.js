const express = require('express')
const router = express.Router()

const { publisherSubscriber } = require('../controllers/routesmanageController')

//routes
router.route('/addroute').post(publisherSubscriber.addroute)
router.route('/getroutes').get(publisherSubscriber.getroutes) 
router.route('/getoneroute').get(publisherSubscriber.getoneroute) 
router.route('/delroute').post(publisherSubscriber.removeroute)


module.exports = router
