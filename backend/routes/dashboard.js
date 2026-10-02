const express = require("express");
const router = express.Router();
const { handleDashboard } = require("../controllers/dashboard");
const { restrictToLoggedInUser } = require("../middlewares/auth");

router.use(restrictToLoggedInUser);
router.route("/").get(handleDashboard);


module.exports = router;