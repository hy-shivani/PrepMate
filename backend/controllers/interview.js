const Interview = require("../models/interview");

const { createTechnicalInterviewPlan,
    evaluateInterviewAnswer,
    generateNextInterviewQuestion,
    generateAptitudeReport,
    generateNextHRInterviewQuestion,
    generateTechnicalReport, generateHRReport } = require("../service/ai");

const User = require("../models/user");
const Question = require("../models/questions");

const {
    createTechnicalInterview,
    createAptitudeInterview,
    createHRInterview,
} = require("./interview_create");

const {
    startTechnicalInterview,
    startAptitudeInterview,
    startHRInterview
} = require("./interview_start");


// Handle create interview
async function handleCreateInterview(req, res) {
    try {

        const {
            jobRole,
            company,
            experienceLevel,
            difficulty,
            interviewMode,
            numberOfQuestions
        } = req.body;


        // Check required fields
        if (
            !jobRole ||
            !experienceLevel ||
            !difficulty ||
            !interviewMode
        ) {
            return res.status(400).json({
                message: "Please fill all the required fields."
            });
        }


        // Number of questions is required for Aptitude and HR interviews
        if (
            (interviewMode === "Aptitude" || interviewMode === "HR") &&
            (!numberOfQuestions || numberOfQuestions < 1)
        ) {
            return res.status(400).json({
                message: "Please provide a valid number of questions."
            });
        }


        // Technical interview
        if (interviewMode === "Technical") {

            const interview = await createTechnicalInterview({
                userId: req.user._id,
                jobRole,
                company,
                experienceLevel,
                difficulty
            });

            return res.status(201).json({
                message: "Technical interview created successfully.",
                interview
            });
        }


        // Aptitude interview
        if (interviewMode === "Aptitude") {

            const interview = await createAptitudeInterview({
                userId: req.user._id,
                jobRole,
                company,
                experienceLevel,
                difficulty,
                numberOfQuestions
            });

            return res.status(201).json({
                message: "Aptitude interview created successfully.",
                interview
            });
        }

        // HR interview
        if (interviewMode === "HR") {

            const interview = await createHRInterview({
                userId: req.user._id,
                jobRole,
                company,
                experienceLevel,
                difficulty,
                numberOfQuestions
            });

            return res.status(201).json({
                message: "HR interview created successfully.",
                interview
            });
        }


    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: err.message
        });
    }
}



// Start Interview
async function handleStartInterview(req, res) {
    try {

        // Find the interview belonging to the logged-in user
        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found."
            });
        }


        // Interview should only be started once
        if (interview.status !== "Not Started") {
            return res.status(400).json({
                message: "Interview has already been started."
            });
        }


        // Get logged-in user's details
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }


        let question;


        // Start Technical interview
        if (interview.interviewMode === "Technical") {

            question = await startTechnicalInterview(
                interview,
                user
            );

        }


        // Start Aptitude interview
        else if (interview.interviewMode === "Aptitude") {

            question = await startAptitudeInterview(
                interview
            );

        }


        // Start HR interview
        else if (interview.interviewMode === "HR") {

            question = await startHRInterview(
                interview,
                user
            );

        }


        // Invalid interview mode
        else {
            return res.status(400).json({
                message: "Invalid interview mode."
            });
        }


        // Return first question
        return res.status(200).json({

            message: "Interview started successfully.",

            question: {
                _id: question._id,
                question: question.question,
                options: question.options,
                section: question.section,
                topic: question.topic,
                questionType: question.questionType,
                sequenceNumber: question.sequenceNumber
            }
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: err.message
        });
    }
}
// Get All Interviews
async function handleGetAllInterviews(req, res) {
    try {

        const interviews = await Interview.find({
            user: req.user._id,
        });

        return res.status(200).json(interviews);

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }
}

// Get Interview By ID
async function handleGetInterviewById(req, res) {
    try {

        const interview = await Interview.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found.",
            });
        }

        return res.status(200).json(interview);

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }
}

// Delete Interview
async function handleDeleteInterview(req, res) {
    try {

        const interview = await Interview.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found.",
            });
        }

        return res.status(200).json({
            message: "Interview deleted successfully.",
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message,
        });

    }
}

// Submit answer and check for follow up or not
async function handleSubmitAnswer(req, res) {
    try {

        const {
            interviewId,
            questionId,
            userAnswer
        } = req.body;


        // Find the interview
        const interview = await Interview.findOne({
            _id: interviewId,
            user: req.user._id
        });

        if (!interview) {
            return res.status(404).json({
                message: "Interview not found."
            });
        }

        if (interview.status !== "In Progress") {
            return res.status(400).json({
                message: `Interview is not in progress. Current status: ${interview.status}.`
            });
        }

        // Find the question from Questions collection
        const question = await Question.findOne({
            _id: questionId,
            interview: interview._id
        });

        if (!question) {
            return res.status(404).json({
                message: "Question not found."
            });
        }

        if (String(interview.currentState.currentQuestion) !== String(question._id)) {
            return res.status(400).json({
                message: "This is not the current active question."
            });
        }

        // Prevent duplicate answer submission
        if (question.answerSubmitted) {
            return res.status(400).json({
                message: "Answer has already been submitted for this question."
            });
        }

        if (!userAnswer || !userAnswer.trim()) {
            return res.status(400).json({
                message: "Answer cannot be empty."
            });
        }

        // Store candidate's answer
        question.userAnswer = userAnswer;

        // Evaluate answer using Gemini
        const evaluation = await evaluateInterviewAnswer({
            question: question.question,
            userAnswer: userAnswer,
            round: question.round
        });

        // Store evaluation
        // Backend remains authoritative for IDK responses.
        if (evaluation.responseType === "idk") {
            evaluation.score = 0;
            evaluation.correctness = 0;
            evaluation.relevance = 0;
            evaluation.clarity = 0;
            evaluation.understanding = 0;
            evaluation.completeness = 0;
            evaluation.followUpNeeded = false;
        }

        question.evaluation.responseType = evaluation.responseType;
        question.evaluation.containsInjectionAttempt =
            evaluation.containsInjectionAttempt;

        question.evaluation.correctness = evaluation.correctness;
        question.evaluation.relevance = evaluation.relevance;
        question.evaluation.clarity = evaluation.clarity;
        question.evaluation.understanding = evaluation.understanding;
        question.evaluation.completeness = evaluation.completeness;
        question.evaluation.score = evaluation.score;
        question.evaluation.feedback = evaluation.feedback;
        question.evaluation.whatWasGood = evaluation.whatWasGood;
        question.evaluation.whatWasMissing = evaluation.whatWasMissing;
        question.evaluation.expectedAnswer = evaluation.expectedAnswer;

        // Mark answer as submitted
        question.answerSubmitted = true;

        // Save the candidate's answer and evaluation
        await question.save();

        // Get current interview state
        const currentTopic = interview.currentState.topic;
        const followUpCount = interview.currentState.followUpCount;

        // Follow-up decision comes directly from AI evaluation,
        // NOT from the score.
        const shouldAskFollowUp =
            evaluation.responseType !== "idk" &&
            evaluation.followUpNeeded &&
            followUpCount < 2;



        if (shouldAskFollowUp) {

            const user = await User.findById(req.user._id);

            const generatedQuestion =
                await generateNextInterviewQuestion({
                    topicContext:
                        question.section === "Resume"
                            ? interview.interviewPlan.resumeTopics.find(
                                item => item.topic === currentTopic
                            )?.sourceExcerpt
                            : null,

                    jobRole: interview.jobRole,

                    experienceLevel:
                        interview.experienceLevel,

                    difficulty:
                        interview.difficulty,

                    section: question.section,

                    topic: currentTopic,

                    questionType: "FollowUp",

                    previousQuestion: question.question,

                    previousAnswer: userAnswer
                });


            const nextQuestion = await Question.create({

                interview: interview._id,

                round: question.round,

                section: question.section,

                topic: currentTopic,

                question: generatedQuestion.question,

                questionType: "FollowUp",

                parentQuestion: question._id,

                sequenceNumber: question.sequenceNumber + 1
            });


            interview.currentState.followUpCount += 1;

            interview.currentState.currentQuestion =
                nextQuestion._id;


            await interview.save();


            return res.status(200).json({

                message: "Follow-up question generated.",

                question: {
                    _id: nextQuestion._id,
                    question: nextQuestion.question,
                    section: nextQuestion.section,
                    topic: nextQuestion.topic,
                    questionType: nextQuestion.questionType
                }
            });
        }


        // Current topic is completed

        if (question.section === "Resume") {

            const topic = interview.interviewPlan.resumeTopics.find(
                item => item.topic === currentTopic
            );

            if (topic) {
                topic.status = "Completed";
            }

        }
        else if (question.section === "CS Fundamentals") {

            const topic = interview.interviewPlan.csFundamentals.find(
                item => item.topic === currentTopic
            );

            if (topic) {
                topic.status = "Completed";
            }
        }


        // Find the next pending Resume topic
        let nextTopic = null;

        if (question.section === "Resume") {
            nextTopic = interview.interviewPlan.resumeTopics.find(
                item => item.status === "Pending"
            );
        }

        if (nextTopic) {

            // Start the next topic
            nextTopic.status = "In Progress";

            // Reset follow-up count for the new topic
            interview.currentState.followUpCount = 0;


            const user = await User.findById(req.user._id);


            // Generate Main question for new topic
            const generatedQuestion =
                await generateNextInterviewQuestion({

                    topicContext: nextTopic.sourceExcerpt,

                    jobRole: interview.jobRole,

                    experienceLevel:
                        interview.experienceLevel,

                    difficulty:
                        interview.difficulty,

                    section: "Resume",

                    topic: nextTopic.topic,

                    questionType: "Main",

                    previousQuestion: null,

                    previousAnswer: null
                });


            // Store the new question
            const nextQuestion = await Question.create({

                interview: interview._id,

                round: question.round,

                section: "Resume",

                topic: nextTopic.topic,

                question: generatedQuestion.question,

                questionType: "Main",

                parentQuestion: null,

                sequenceNumber:
                    question.sequenceNumber + 1
            });


            // Update current interview state
            interview.currentState.section = "Resume";

            interview.currentState.topic =
                nextTopic.topic;

            interview.currentState.currentQuestion =
                nextQuestion._id;


            await interview.save();


            return res.status(200).json({

                message: "Next topic started.",

                question: {
                    _id: nextQuestion._id,
                    question: nextQuestion.question,
                    section: nextQuestion.section,
                    topic: nextQuestion.topic,
                    questionType: nextQuestion.questionType
                }
            });
        }

        // All Resume topics are completed.
        // Move to CS Fundamentals.

        const nextCSTopic =
            interview.interviewPlan.csFundamentals.find(
                item => item.status === "Pending"
            );

        if (nextCSTopic) {

            nextCSTopic.status = "In Progress";

            interview.currentState.followUpCount = 0;

            const user = await User.findById(req.user._id);

            const generatedQuestion =
                await generateNextInterviewQuestion({

                    topicContext: null,

                    jobRole: interview.jobRole,

                    experienceLevel:
                        interview.experienceLevel,

                    difficulty:
                        interview.difficulty,

                    section: "CS Fundamentals",

                    topic: nextCSTopic.topic,

                    questionType: "Main",

                    previousQuestion: null,

                    previousAnswer: null
                });

            const nextQuestion = await Question.create({

                interview: interview._id,

                round: "Technical",

                section: "CS Fundamentals",

                topic: nextCSTopic.topic,

                question: generatedQuestion.question,

                questionType: "Main",

                parentQuestion: null,

                sequenceNumber:
                    question.sequenceNumber + 1
            });

            interview.currentState.section =
                "CS Fundamentals";

            interview.currentState.topic =
                nextCSTopic.topic;

            interview.currentState.currentQuestion =
                nextQuestion._id;

            await interview.save();

            return res.status(200).json({

                message: "CS Fundamentals section started.",

                question: {
                    _id: nextQuestion._id,
                    question: nextQuestion.question,
                    section: nextQuestion.section,
                    topic: nextQuestion.topic,
                    questionType: nextQuestion.questionType
                }
            });
        }

        // All questions/topics are completed

        const technicalQuestions = await Question.find({
            interview: interview._id,
            round: "Technical"
        }).sort({
            sequenceNumber: 1
        });

        const technicalReport = await generateTechnicalReport({
            questions: technicalQuestions
        });

        interview.finalFeedback = JSON.stringify(technicalReport);

        const totalScore = technicalQuestions.reduce(
            (sum, item) => sum + (item.evaluation?.score || 0),
            0
        );

        // All questions/topics are completed

        interview.scores.technical =
            technicalQuestions.length > 0
                ? totalScore / technicalQuestions.length
                : 0;

        interview.status = "Completed";
        interview.currentState.currentQuestion = null;
        interview.endedAt = new Date();

        await interview.save();

        return res.status(200).json({
            message: "Technical interview completed successfully.",
            interviewCompleted: true,
            score: interview.scores.technical
        });


    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: err.message
        });
    }
}
// ************************************************************************************************************
// Submit Aptitude answer
async function handleSubmitAptitudeAnswer(req, res) {
    try {

        const {
            interviewId,
            questionId,
            userAnswer
        } = req.body;


        // Find the interview
        const interview = await Interview.findOne({
            _id: interviewId,
            user: req.user._id
        });


        if (!interview) {
            return res.status(404).json({
                message: "Interview not found."
            });
        }


        // Make sure interview is in progress
        if (interview.status !== "In Progress") {
            return res.status(400).json({
                message: "Interview is not in progress."
            });
        }


        // Make sure this is an Aptitude interview
        if (interview.interviewMode !== "Aptitude") {
            return res.status(400).json({
                message: "This is not an Aptitude interview."
            });
        }


        // Find the current question
        const question = await Question.findOne({
            _id: questionId,
            interview: interview._id
        });


        if (!question) {
            return res.status(404).json({
                message: "Question not found."
            });
        }


        // Make sure this is the current active question
        if (
            String(interview.currentState.currentQuestion) !==
            String(question._id)
        ) {
            return res.status(400).json({
                message: "This is not the current active question."
            });
        }


        // Prevent duplicate answer submission
        if (question.answerSubmitted) {
            return res.status(400).json({
                message: "Answer has already been submitted."
            });
        }


        if (!userAnswer || !userAnswer.trim()) {
            return res.status(400).json({
                message: "Answer cannot be empty."
            });
        }


        // Store candidate's answer
        question.userAnswer = userAnswer;


        // Check answer directly using the correct answer
        question.isCorrect =
            userAnswer.trim() === question.correctAnswer.trim();


        // Mark answer as submitted
        question.answerSubmitted = true;


        // Save the candidate's answer
        await question.save();


        // Check if this was the last question
        if (
            question.sequenceNumber ===
            interview.numberOfQuestions
        ) {

            // Get all Aptitude questions
            const questions = await Question.find({
                interview: interview._id,
                round: "Aptitude"
            }).sort({
                sequenceNumber: 1
            });


            // Count correct answers
            const correctAnswers =
                questions.filter(question => question.isCorrect).length;


            // Calculate Aptitude score
            interview.scores.aptitude =
                (correctAnswers / questions.length) * 100;

            interview.scores.overall =
                interview.scores.aptitude;


            // Generate final learning report
            const report =
                await generateAptitudeReport({
                    questions
                });


            // Store final report
            interview.finalFeedback =
                JSON.stringify(report);


            // Complete interview
            interview.status = "Completed";

            interview.endedAt = new Date();

            interview.currentState.currentQuestion = null;


            await interview.save();


            return res.status(200).json({

                message: "Aptitude interview completed successfully.",

                interviewCompleted: true,

                score: interview.scores.aptitude,

                report: report
            });
        }


        // Find the next question
        const nextQuestion = await Question.findOne({
            interview: interview._id,
            sequenceNumber: question.sequenceNumber + 1
        });


        if (!nextQuestion) {
            throw new Error("Next aptitude question not found.");
        }


        // Update current interview state
        interview.currentState.topic =
            nextQuestion.topic;

        interview.currentState.currentQuestion =
            nextQuestion._id;


        await interview.save();


        return res.status(200).json({

            message: "Answer submitted successfully.",

            question: {
                _id: nextQuestion._id,
                question: nextQuestion.question,
                options: nextQuestion.options,
                section: nextQuestion.section,
                topic: nextQuestion.topic,
                questionType: nextQuestion.questionType,
                sequenceNumber: nextQuestion.sequenceNumber
            }
        });


    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: err.message
        });
    }
}
// ************************************************************************************************************
// Submit HR answer
async function handleSubmitHRAnswer(req, res) {
    try {

        const {
            interviewId,
            questionId,
            userAnswer
        } = req.body;


        // Find the interview
        const interview = await Interview.findOne({
            _id: interviewId,
            user: req.user._id
        });


        if (!interview) {
            return res.status(404).json({
                message: "Interview not found."
            });
        }


        // Make sure interview is in progress
        if (interview.status !== "In Progress") {
            return res.status(400).json({
                message: "Interview is not in progress."
            });
        }


        // Make sure this is an HR interview
        if (interview.interviewMode !== "HR") {
            return res.status(400).json({
                message: "This is not an HR interview."
            });
        }


        // Find the current question
        const question = await Question.findOne({
            _id: questionId,
            interview: interview._id
        });


        if (!question) {
            return res.status(404).json({
                message: "Question not found."
            });
        }


        // Make sure this is the current active question
        if (
            String(interview.currentState.currentQuestion) !==
            String(question._id)
        ) {
            return res.status(400).json({
                message: "This is not the current active question."
            });
        }


        // Prevent duplicate answer submission
        if (question.answerSubmitted) {
            return res.status(400).json({
                message: "Answer has already been submitted."
            });
        }


        if (!userAnswer || !userAnswer.trim()) {
            return res.status(400).json({
                message: "Answer cannot be empty."
            });
        }


        // Store candidate's answer
        question.userAnswer = userAnswer;


        // Evaluate answer using Gemini
        const evaluation = await evaluateInterviewAnswer({
            question: question.question,
            userAnswer: userAnswer,
            round: "HR"
        });


        // Store evaluation
        question.evaluation.correctness =
            evaluation.correctness;

        question.evaluation.relevance =
            evaluation.relevance;

        question.evaluation.clarity =
            evaluation.clarity;

        question.evaluation.understanding =
            evaluation.understanding;

        question.evaluation.completeness =
            evaluation.completeness;

        question.evaluation.score =
            evaluation.score;

        question.evaluation.feedback =
            evaluation.feedback;

        question.evaluation.whatWasGood =
            evaluation.whatWasGood;

        question.evaluation.whatWasMissing =
            evaluation.whatWasMissing;

        question.evaluation.expectedAnswer =
            evaluation.expectedAnswer;


        // Mark answer as submitted
        question.answerSubmitted = true;


        // Save answer and evaluation
        await question.save();


        // Get current HR topic
        const currentTopic =
            interview.currentState.topic;

        const followUpCount =
            interview.currentState.followUpCount;


        // Count ALL answered HR questions
        // Main questions + Follow-ups both count toward the limit
        const questionsAnswered =
            await Question.countDocuments({
                interview: interview._id,
                round: "HR",
                answerSubmitted: true
            });


        // Follow-up decision comes directly from AI evaluation
        // Maximum 2 follow-ups
        // Follow-ups must also stay within the selected question limit
        const shouldAskFollowUp =
            evaluation.followUpNeeded &&
            followUpCount < 2 &&
            questionsAnswered < interview.numberOfQuestions;


        // ************************************************************************************************************
        // Generate HR follow-up
        if (shouldAskFollowUp) {

            const user = await User.findById(
                req.user._id
            );


            if (!user || !user.resume?.text) {
                throw new Error(
                    "Candidate resume not found."
                );
            }


            const generatedQuestion =
                await generateNextHRInterviewQuestion({

                    resumeText: user.resume.text,

                    jobRole: interview.jobRole,

                    company: interview.company,

                    experienceLevel:
                        interview.experienceLevel,

                    difficulty:
                        interview.difficulty,

                    topic: currentTopic,

                    questionType: "FollowUp",

                    previousQuestion:
                        question.question,

                    previousAnswer:
                        userAnswer
                });


            const nextQuestion =
                await Question.create({

                    interview: interview._id,

                    round: "HR",

                    section: "General",

                    topic: currentTopic,

                    question:
                        generatedQuestion.question,

                    questionType: "FollowUp",

                    parentQuestion:
                        question._id,

                    sequenceNumber:
                        question.sequenceNumber + 1
                });


            interview.currentState.followUpCount += 1;

            interview.currentState.currentQuestion =
                nextQuestion._id;


            await interview.save();


            return res.status(200).json({

                message:
                    "Follow-up question generated.",

                question: {
                    _id: nextQuestion._id,

                    question:
                        nextQuestion.question,

                    section:
                        nextQuestion.section,

                    topic:
                        nextQuestion.topic,

                    questionType:
                        nextQuestion.questionType,

                    sequenceNumber:
                        nextQuestion.sequenceNumber
                }
            });
        }


        // ************************************************************************************************************
        // Current HR topic is completed

        const topic =
            interview.interviewPlan.hrTopics.find(
                item => item.topic === currentTopic
            );


        if (topic) {
            topic.status = "Completed";
        }


        // Reset follow-up count
        interview.currentState.followUpCount = 0;





        // ************************************************************************************************************
        // Check whether HR interview is complete
        if (
            questionsAnswered >=
            interview.numberOfQuestions
        ) {

            const questions =
                await Question.find({
                    interview: interview._id,
                    round: "HR"
                }).sort({
                    sequenceNumber: 1
                });


            // Calculate HR score
            // Calculate HR score
            const totalScore =
                questions.reduce(
                    (sum, item) =>
                        sum + (item.evaluation?.score || 0),
                    0
                );

            interview.scores.hr =
                questions.length > 0
                    ? totalScore / questions.length
                    : 0;

            // Generate final HR interview report
            const report = await generateHRReport({
                questions
            });

            interview.finalFeedback = JSON.stringify(report);

            interview.status = "Completed";

            interview.endedAt = new Date();

            interview.currentState.currentQuestion =
                null;


            await interview.save();


            return res.status(200).json({

                message:
                    "HR interview completed successfully.",

                interviewCompleted: true,

                score:
                    interview.scores.hr,
                report
            });
        }


        // ************************************************************************************************************
        // Find next pending HR topic

        const nextTopic =
            interview.interviewPlan.hrTopics.find(
                item => item.status === "Pending"
            );


        if (!nextTopic) {
            const questions = await Question.find({
                interview: interview._id,
                round: "HR"
            }).sort({
                sequenceNumber: 1
            });

            const totalScore = questions.reduce(
                (sum, item) =>
                    sum + (item.evaluation?.score || 0),
                0
            );

            interview.scores.hr =
                questions.length > 0
                    ? totalScore / questions.length
                    : 0;

            const report = await generateHRReport({
                questions
            });

            interview.finalFeedback =
                JSON.stringify(report);

            interview.status = "Completed";
            interview.endedAt = new Date();
            interview.currentState.currentQuestion = null;

            await interview.save();

            return res.status(200).json({
                message: "HR interview completed successfully.",
                interviewCompleted: true,
                score: interview.scores.hr,
                report
            });
        }


        // Start next topic
        nextTopic.status = "In Progress";


        // Generate Main question for next topic
        const user =
            await User.findById(req.user._id);


        if (!user || !user.resume?.text) {
            throw new Error(
                "Candidate resume not found."
            );
        }


        const generatedQuestion =
            await generateNextHRInterviewQuestion({

                resumeText: user.resume.text,

                jobRole: interview.jobRole,

                company: interview.company,

                experienceLevel:
                    interview.experienceLevel,

                difficulty:
                    interview.difficulty,

                topic: nextTopic.topic,

                questionType: "Main",

                previousQuestion: null,

                previousAnswer: null
            });


        // Store new HR question
        const nextQuestion =
            await Question.create({

                interview: interview._id,

                round: "HR",

                section: "General",

                topic: nextTopic.topic,

                question:
                    generatedQuestion.question,

                questionType: "Main",

                parentQuestion: null,

                sequenceNumber:
                    question.sequenceNumber + 1
            });


        // Update current interview state
        interview.currentState.topic =
            nextTopic.topic;

        interview.currentState.section =
            "General";

        interview.currentState.currentQuestion =
            nextQuestion._id;


        await interview.save();


        return res.status(200).json({

            message:
                "Next HR topic started.",

            question: {
                _id: nextQuestion._id,

                question:
                    nextQuestion.question,

                section:
                    nextQuestion.section,

                topic:
                    nextQuestion.topic,

                questionType:
                    nextQuestion.questionType,

                sequenceNumber:
                    nextQuestion.sequenceNumber
            }
        });


    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    handleCreateInterview,
    handleStartInterview,
    handleGetAllInterviews,
    handleGetInterviewById,
    handleDeleteInterview,
    handleSubmitAnswer,
    handleSubmitAptitudeAnswer,
    handleSubmitHRAnswer,
};