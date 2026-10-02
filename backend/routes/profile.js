const express = require("express");
const router = express.Router();

const {
    handleGetProfile,
    handleUpdateProfile } = require("../controllers/profile");

const { restrictToLoggedInUser } = require("../middlewares/auth");

// Apply authentication middleware to all profile routes
router.use(restrictToLoggedInUser);

router.get("/", handleGetProfile);

const upload = require("../middlewares/multer");

router.patch(
    "/",
    upload.single("resume"),
    handleUpdateProfile
);

module.exports = router;