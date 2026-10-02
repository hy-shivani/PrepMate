const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        jobRole: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            default: "",
            trim: true,
        },

        experienceLevel: {
            type: String,
            enum: ["Fresher", "0-1 Years", "1-3 Years", "3+ Years"],
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        // for aptitude and hr based interview
        numberOfQuestions: {
            type: Number,
            min: 1,
            default: null,
        },

        interviewMode: {
            type: String,
            enum: ["Technical", "HR", "Aptitude"],
            required: true,
        },

        // What this interview is supposed to cover
        interviewPlan: {
            resumeTopics: [
                {
                    topic: {
                        type: String,
                        required: true,
                    },
                    sourceExcerpt: {
                        type: String,
                        required: true,
                    },


                    status: {
                        type: String,
                        enum: ["Pending", "In Progress", "Completed"],
                        default: "Pending",
                    },
                },
            ],
            csFundamentals: [
                {
                    topic: {
                        type: String,
                    },

                    status: {
                        type: String,
                        enum: ["Pending", "In Progress", "Completed"],
                        default: "Pending",
                    },
                },
            ],
            hrTopics: [
                {
                    topic: {
                        type: String,
                        required: true,
                    },

                    status: {
                        type: String,
                        enum: ["Pending", "In Progress", "Completed"],
                        default: "Pending",
                    },
                },
            ],
        },

        // Where the interview currently is
        currentState: {
            round: {
                type: String,
                enum: ["Aptitude", "Technical", "HR"],
                default: "Technical",
            },

            section: {
                type: String,
                enum: ["Resume", "CS Fundamentals", "General"],
                default: "General",
            },

            topic: {
                type: String,
                default: "",
            },

            followUpCount: {
                type: Number,
                default: 0,
            },

            // The question the candidate is currently answering
            currentQuestion: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
                default: null,
            },
        },

        scores: {
            aptitude: {
                type: Number,
                default: 0,
            },

            technical: {
                type: Number,
                default: 0,
            },

            hr: {
                type: Number,
                default: 0,
            },

            overall: {
                type: Number,
                default: 0,
            },
        },

        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started",
        },

        startedAt: {
            type: Date,
        },

        endedAt: {
            type: Date,
        },

        duration: {
            type: Number,
            default: 0,
        },

        finalFeedback: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;