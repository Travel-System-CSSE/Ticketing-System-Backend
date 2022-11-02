const Route = require("../models/Route");
const RouteTaken = require("../models/RoutesTaken");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const CommonConstants = require('../CommonConstants')

var publisherSubscriber = {};
/**
 * Controller for the routes managment
 * Observer pattern
 */
(function (container) {
  //FUNCTION to add route
  container.addroute = async (req, res) => {
    const {
      Routename,
      bus,
      startpoint,
      stops,
      starttime,
      endtime,
      totdistance,
      addedby,
    } = req.body;

    if (
      !Routename ||
      !bus ||
      !startpoint ||
      !stops ||
      !starttime ||
      !endtime ||
      !totdistance ||
      !addedby
    ) {
      throw new CustomError.BadRequestError(CommonConstants.EMPTY_FIELDS);
    }

    const CHECKEXIST = await Route.findOne({ Routename });
    if (CHECKEXIST) {
      throw new CustomError.BadRequestError(CommonConstants.ROUTE_ALREADY_EXISTS);
    }

    const ROUTE = await Route.create({
      Routename,
      bus,
      startpoint,
      stops,
      starttime,
      endtime,
      totdistance,
      addedby,
    });

    res.status(StatusCodes.CREATED).json({ route: ROUTE });
  };
  //FUNCTION to get all route plans
  container.getroutes = async (req, res) => {
    const ROUTES = await Route.find({});
    console.log(ROUTES);
    res.status(StatusCodes.CREATED).json({ routes: ROUTES });
  };

  //FUNCTION get one route plan
  container.getoneroute = async (req, res) => {
    const { id } = req.body;
    const ROUTE = await Route.findById(id);
    console.log(routes);
    res.status(StatusCodes.CREATED).json({ routes: ROUTE });
  };

  //FUNCTION to remove route
  container.removeroute = async (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
      const ROUTE = await Route.findByIdAndDelete(id);
      console.log(ROUTE);
      res.status(200).send({ msg: "success" });
    } catch (error) {
      res.status(400).send({ msg: "error" });
    }
  };

  //FUNCTION to get data for report generation
  container.reportData = async (req, res) => {
    try {
      //aggregate routestaken and routes
      let report = await Route.aggregate([
        {
          $lookup: {
            from: 'routetakens',
            localField: '_id',
            foreignField: 'RouteID',
            as: 'report',
          },
        },
      ])
      let totalUsers = await RouteTaken.countDocuments()
  
      res.status(StatusCodes.OK).json({ report,totalUsers })
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST)
    }
  };
   //FUNCTION to get data for report generation
   container.dummy = async (req, res) => {
    const { RouteID, UserDetails} = req.body
    try {
      const report=await RouteTaken.create({
        RouteID, UserDetails
      })
      res.status(StatusCodes.OK).json({ report })
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST)
    }
  };
})(publisherSubscriber);

module.exports = { publisherSubscriber };

