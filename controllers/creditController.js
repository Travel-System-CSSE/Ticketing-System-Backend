const Credit = require("../models/Credit");

exports.createCredit = async (req, res, next) => {
  try {
    const credit = await Credit.create(req.body);
    res.status(201).json({
      status: "success",
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
    res.status(200).json({
      status: "success",
      documents,
    });
  } catch (error) {
    res.json({
      status: "fail",
      result: error,
    });
  }
};
