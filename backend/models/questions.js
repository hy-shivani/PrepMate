const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
            required: true,
        },

        round: {
            type: String,
            enum: ["Aptitude", "Technical", "HR"],
            required: true,
        },

        section: {
            type: String,
            enum: ["Resume", "CS Fundamentals", "General"],
            required: true,
        },

        topic: {
            type: String,
            required: true,
        },

        question: {
            type: String,
            required: true,
        },
        //aptitude
        options: {
            type: [String],
            default: [],
        },
        //aptitude
        correctAnswer: {
            type: String,
            default: "",
        },
        //aptitude
        isCorrect: {
            type: Boolean,
            default: null,
        },

        questionType: {
            type: String,
            enum: ["Main", "FollowUp"],
            default: "Main",
        },

        parentQuestion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            default: null,
        },

        userAnswer: {
            type: String,
            default: "",
        },

        answerSubmitted: {
            type: Boolean,
            default: false,
        },
        // Stores the order in which this question was asked
        // within the current interview.
        // Example: 1 = first question, 2 = second question, etc.
        // This helps us reconstruct the complete interview conversation
        // in the exact order it happened.
        sequenceNumber: {
            type: Number,
            required: true,
        },

        evaluation: {

            responseType: {
                type: String,
                enum: ["answered", "partial", "idk"],
                default: "answered",
            },
            //technical
            correctness: {
                type: Number,
                default: 0,
            },

            relevance: {
                type: Number,
                default: 0,
            },

            clarity: {
                type: Number,
                default: 0,
            },

            understanding: {
                type: Number,
                default: 0,
            },

            completeness: {
                type: Number,
                default: 0,
            },

            score: {
                type: Number,
                default: 0,
            },

            feedback: {
                type: String,
                default: "",
            },

            whatWasGood: {
                type: String,
                default: "",
            },

            whatWasMissing: {
                type: String,
                default: "",
            },

            expectedAnswer: {
                type: String,
                default: "",
            },

            containsInjectionAttempt: {
                type: Boolean,
                default: false,
            },
        }

    },
    {
        timestamps: true,
    }
);

// Index
//index is organized in ascending order first by interview, and within that index structure, by topic.
questionSchema.index({
    interview: 1,
    topic: 1,
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;