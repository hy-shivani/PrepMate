const express = require("express");

const {
    handleCreateInterview,
    handleStartInterview,
    handleGetAllInterviews,
    handleGetInterviewById,
    handleDeleteInterview,
    handleSubmitAnswer,
    handleSubmitHRAnswer,
    handleSubmitAptitudeAnswer,
} = require("../controllers/interview");

const { restrictToLoggedInUser } = require("../middlewares/auth");

const router = express.Router();

// Apply authentication middleware to all interview routes
router.use(restrictToLoggedInUser);

router
    .route("/")
    .get(handleGetAllInterviews)
    .post(handleCreateInterview);

router
    .route("/:id")
    .get(handleGetInterviewById)
    .delete(handleDeleteInterview);

//Put specific/static routes like /answer before dynamic routes like /:id,
//  because /:id can match any single path segment such as answer.



router
    .route("/answer")
    .post(handleSubmitAnswer);

router
    .route("/hr-answer")
    .post(handleSubmitHRAnswer);

router
    .route("/aptitude-answer")
    .post(handleSubmitAptitudeAnswer);

router
    .route("/:id/start")
    .post(handleStartInterview);


module.exports = router;