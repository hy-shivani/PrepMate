const Question = require("../models/questions");
const Interview = require("../models/interview");

const {
    generateNextInterviewQuestion,
    generateAptitudeQuestions,
    generateNextHRInterviewQuestion,
} = require("../service/ai");


// Start Technical Interview
async function startTechnicalInterview(interview, user) {

    // Get candidate's resume
    if (!user || !user.resume?.text) {
        throw new Error("Candidate resume not found.");
    }


    // Find the first pending Resume topic
    const topic = interview.interviewPlan.resumeTopics.find(
        item => item.status === "Pending"
    );

    if (!topic) {
        throw new Error("No Resume topics available.");
    }


    // Mark this topic as currently being discussed
    topic.status = "In Progress";


    // Generate the first Main question
    const generatedQuestion =
        await generateNextInterviewQuestion({

            topicContext: topic.sourceExcerpt,

            jobRole: interview.jobRole,

            experienceLevel:
                interview.experienceLevel,

            difficulty:
                interview.difficulty,

            section: "Resume",

            topic: topic.topic,

            questionType: "Main",

            previousQuestion: null,

            previousAnswer: null
        });


    // First question of this interview = sequence 1
    const question = await Question.create({

        interview: interview._id,

        round: interview.interviewMode,

        section: "Resume",

        topic: topic.topic,

        question: generatedQuestion.question,

        questionType: "Main",

        parentQuestion: null,

        sequenceNumber: 1
    });


    // Update current interview state
    interview.currentState.round =
        interview.interviewMode;

    interview.currentState.section =
        "Resume";

    interview.currentState.topic =
        topic.topic;

    interview.currentState.followUpCount = 0;

    interview.currentState.currentQuestion =
        question._id;


    // Interview has now started
    interview.status = "In Progress";

    await interview.save();


    return question;
}

// ************************************************************************************************************
// Start Aptitude Interview
async function startAptitudeInterview(interview) {

    // Generate all aptitude questions at once
    const generatedQuestions =
        await generateAptitudeQuestions({

            jobRole: interview.jobRole,

            experienceLevel:
                interview.experienceLevel,

            difficulty:
                interview.difficulty,

            numberOfQuestions:
                interview.numberOfQuestions
        });


    // Make sure questions were generated
    if (!generatedQuestions.questions ||
        generatedQuestions.questions.length === 0) {

        throw new Error("No aptitude questions were generated.");
    }


    // Save all generated questions
    const questions = [];

    for (let i = 0; i < generatedQuestions.questions.length; i++) {

        const item = generatedQuestions.questions[i];

        const question = await Question.create({

            interview: interview._id,

            round: "Aptitude",

            section: "General",

            topic: item.topic,

            question: item.question,

            questionType: "Main",

            parentQuestion: null,

            options: item.options,

            correctAnswer: item.correctAnswer,

            sequenceNumber: i + 1
        });

        questions.push(question);
    }


    // Make the first question the current active question
    const firstQuestion = questions[0];

    interview.currentState.round = "Aptitude";

    interview.currentState.section = "General";

    interview.currentState.topic = firstQuestion.topic;

    interview.currentState.followUpCount = 0;

    interview.currentState.currentQuestion =
        firstQuestion._id;


    // Interview has now started
    interview.status = "In Progress";

    interview.startedAt = new Date();

    await interview.save();


    return firstQuestion;
}
// ************************************************************************************************************
// Start HR Interview
async function startHRInterview(interview, user) {

    // Get candidate's resume
    if (!user || !user.resume?.text) {
        throw new Error("Candidate resume not found.");
    }


    // Find the first pending HR topic
    const topic = interview.interviewPlan.hrTopics.find(
        item => item.status === "Pending"
    );

    if (!topic) {
        throw new Error("No HR topics available.");
    }


    // Mark this topic as currently being discussed
    topic.status = "In Progress";


    // Generate the first Main HR question
    const generatedQuestion =
        await generateNextHRInterviewQuestion({

            resumeText: user.resume.text,

            jobRole: interview.jobRole,

            company: interview.company,

            experienceLevel:
                interview.experienceLevel,

            difficulty:
                interview.difficulty,

            topic: topic.topic,

            questionType: "Main",

            previousQuestion: null,

            previousAnswer: null
        });


    // First question of this interview = sequence 1
    const question = await Question.create({

        interview: interview._id,

        round: "HR",

        section: "General",

        topic: topic.topic,

        question: generatedQuestion.question,

        questionType: "Main",

        parentQuestion: null,

        sequenceNumber: 1
    });


    // Update current interview state
    interview.currentState.round = "HR";

    interview.currentState.section = "General";

    interview.currentState.topic =
        topic.topic;

    interview.currentState.followUpCount = 0;

    interview.currentState.currentQuestion =
        question._id;


    // Interview has now started
    interview.status = "In Progress";

    interview.startedAt = new Date();

    await interview.save();


    return question;
}

module.exports = {
    startTechnicalInterview,
    startAptitudeInterview,
    startHRInterview,
};