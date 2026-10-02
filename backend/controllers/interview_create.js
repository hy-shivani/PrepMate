const User = require("../models/user");
const Interview = require("../models/interview");

const {
    createTechnicalInterviewPlan,
    createHRInterviewPlan,
} = require("../service/ai");


// ************************************************************************************************************
// Create Technical Interview
async function createTechnicalInterview({
    userId,
    jobRole,
    company,
    experienceLevel,
    difficulty
}) {

    // Get logged-in user
    const user = await User.findById(userId);

    // Resume is required for Technical interviews
    if (!user || !user.resume?.text) {
        throw new Error("Please upload your resume first.");
    }


    let resumeTopics = [];
    let csFundamentals = [];


    // Ask AI to identify meaningful topics from resume
    const plan = await createTechnicalInterviewPlan({
        resumeText: user.resume.text,
        jobRole,
        experienceLevel,
        difficulty
    });


    resumeTopics = plan.resumeTopics.map(item => ({
        topic: item.topic,
        sourceExcerpt: item.sourceExcerpt,
        status: "Pending"
    }));


    // Our backend controls CS coverage
    csFundamentals = [
        {
            topic: "DBMS",
            status: "Pending"
        },
        {
            topic: "Operating Systems",
            status: "Pending"
        },
        {
            topic: "Computer Networks",
            status: "Pending"
        },
        {
            topic: "OOP",
            status: "Pending"
        }
    ];


    // Create interview
    const interview = await Interview.create({

        user: userId,

        jobRole,

        company,

        experienceLevel,

        difficulty,

        interviewMode: "Technical",


        interviewPlan: {
            resumeTopics,
            csFundamentals
        },


        currentState: {
            round: "Technical",
            section: "Resume",
            topic: "",
            followUpCount: 0,
            currentQuestion: null
        },


        status: "Not Started"
    });


    return interview;
}



// ************************************************************************************************************
// Create Aptitude Interview
async function createAptitudeInterview({
    userId,
    jobRole,
    company,
    experienceLevel,
    difficulty,
    numberOfQuestions
}) {

    // Create interview
    const interview = await Interview.create({

        user: userId,

        jobRole,

        company,

        experienceLevel,

        difficulty,

        interviewMode: "Aptitude",

        numberOfQuestions,


        // Aptitude does not require resume topics or CS fundamentals
        interviewPlan: {
            resumeTopics: [],
            csFundamentals: []
        },


        currentState: {
            round: "Aptitude",
            section: "General",
            topic: "Aptitude",
            followUpCount: 0,
            currentQuestion: null
        },


        status: "Not Started"
    });


    return interview;
}
// ************************************************************************************************************
// Create HR Interview
async function createHRInterview({
    userId,
    jobRole,
    company,
    experienceLevel,
    difficulty,
    numberOfQuestions
}) {

    // Get logged-in user
    const user = await User.findById(userId);

    // Resume is useful for personalized HR questions
    if (!user || !user.resume?.text) {
        throw new Error("Please upload your resume first.");
    }


    // Ask AI to create the HR interview plan
    const plan = await createHRInterviewPlan({

        resumeText: user.resume.text,

        jobRole,

        company,

        experienceLevel,

        difficulty
    });


    // Make sure HR topics were generated
    if (
        !plan.hrTopics ||
        plan.hrTopics.length === 0
    ) {
        throw new Error("No HR topics were generated.");
    }


    // Convert topics into our interview state
    const hrTopics = plan.hrTopics.map(item => ({
        topic: item.topic,
        status: "Pending"
    }));


    // Create interview
    const interview = await Interview.create({

        user: userId,

        jobRole,

        company,

        experienceLevel,

        difficulty,

        interviewMode: "HR",

        numberOfQuestions,


        interviewPlan: {
            resumeTopics: [],
            csFundamentals: [],
            hrTopics
        },


        currentState: {
            round: "HR",
            section: "General",
            topic: "",
            followUpCount: 0,
            currentQuestion: null
        },


        status: "Not Started"
    });


    return interview;
}


// ************************************************************************************************************

module.exports = {
    createTechnicalInterview,
    createAptitudeInterview,
    createHRInterview,
};