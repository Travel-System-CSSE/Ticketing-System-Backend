const Route = require("../models/Route");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

var publisherSubscriber = {};
//observer pattern
(function (container) {
  //!  CONTROLLER to add route
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
      throw new CustomError.BadRequestError("Please provide all values");
    }

    const CHECKEXIST = await Route.findOne({ Routename });
    if (CHECKEXIST) {
      throw new CustomError.BadRequestError("Route already exists");
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
  //! CONTROLLER to get all route plans
  container.getroutes = async (req, res) => {
    const ROUTES = await Route.find({});
    console.log(ROUTES);
    res.status(StatusCodes.CREATED).json({ routes: ROUTES });
  };

  //! CONTROLLER get one route plan
  container.getoneroute = async (req, res) => {
    const { id } = req.body;
    const ROUTE = await Route.findById(id);
    console.log(routes);
    res.status(StatusCodes.CREATED).json({ routes: ROUTE });
  };

  //! CONTROLLER to remove route
  container.removeroute = async (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
      const ROUTE = await Route.findByIdAndDelete(id);
      console.log(ROUTE);
      res.status(200).send({ msg: "succes" });
    } catch (error) {
      res.status(400).send({ msg: "error" });
    }
  };
})(publisherSubscriber);

module.exports = { publisherSubscriber };
