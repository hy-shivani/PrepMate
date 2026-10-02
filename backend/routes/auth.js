const express = require("express");
const router = express.Router();

const { handleSignUP, handleLogin, handleLogout } = require("../controllers/auth");


router.route("/signUp").post(handleSignUP);
router.route("/login").post(handleLogin);
router.route("/logout").post(handleLogout);


module.exports = router;