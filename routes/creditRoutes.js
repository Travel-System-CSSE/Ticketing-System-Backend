const express = require("express");
const router = express.Router();
const { createCredit, getCredit } = require("../controllers/creditController");

router.route("/:id").get(getCredit);
router.route("/").post(createCredit);

module.exports = router;
