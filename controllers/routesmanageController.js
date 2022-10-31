const Route = require("../models/Route");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

//! addroute CONTROLLER
const addroute = async (req, res) => {
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

  const checkexist = await Route.findOne({ Routename });
  if (checkexist) {
    throw new CustomError.BadRequestError("Route already exists");
  }

  const route = await Route.create({
    Routename,
    bus,
    startpoint,
    stops,
    starttime,
    endtime,
    totdistance,
    addedby,
  });

  res.status(StatusCodes.CREATED).json({ route });
};
//! get routes CONTROLLER
const getroutes = async (req, res) => {
  const routes = await Route.find({});
  console.log(routes);
  res.status(StatusCodes.CREATED).json({ routes });
};
//! get one route  CONTROLLER
const getoneroute = async (req, res) => {
    const { id } = req.body;
    const routes = await Route.findById(id);
    console.log(routes);
    res.status(StatusCodes.CREATED).json({ routes });
  };

//! get routes CONTROLLER
const removeroute = async (req, res) => {
  const { id } = req.body;
  console.log(id)
  try {
    const routes = await Route.findByIdAndDelete(id);
    console.log(routes)
    res.status(200).send({msg:"succes"});
  } catch (error) {
    res.status(400).send({msg:"error"});
  }
};

module.exports = { addroute, getroutes, removeroute,getoneroute};
