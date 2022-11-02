const Credit = require("../models/Credit");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

exports.createCredit = async (req, res, next) => {
  try {
    const credit = await Credit.create(req.body);
    res.status(StatusCodes.CREATED).json({
      data: {
        credit,
      },
    });
  } catch (error) {
    res.json({
      status: "fail",
      result: error,
    });
  }
};

exports.getCredit = async (req, res) => {
  try {
    const { id } = req.params;
    const documents = await Credit.find({ userId: id });
    res.status(StatusCodes.OK).json({
      documents,
    });
  } catch (error) {
    throw new CustomError.NotFoundError("Invalid User Id Found");
  }
};

exports.deleteCredit = async (req, res) => {
  const credit = await Credit.findOne({ _id: req.params.id });
  if (!credit) {
    throw new CustomError.NotFoundError(
      `No credit found for this user with id : ${req.params.id}`
    );
  }
  await Credit.deleteOne({ _id: req.params.id });
  res.status(StatusCodes.OK).json({ msg: "Success! Credit Deleted." });
};
