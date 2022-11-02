const express = require("express");
const router = express.Router();
const {
  createCredit,
  getCredit,
  deleteCredit,
} = require("../controllers/creditController");

router.route("/:id").get(getCredit);
router.route("/").post(createCredit);
router.route("/:id").delete(deleteCredit);

module.exports = router;
