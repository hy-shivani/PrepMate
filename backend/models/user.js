
const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({


    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {

        type: String,
        enum: ["candidate", "Admin"],
        default: "candidate"
    },



    college: {
        type: String,
        default: "",
        trim: true,
    },

    branch: {
        type: String,
        default: "",
        trim: true,
    },

    graduationYear: {
        type: Number,
    },

    skills: [{
        type: String,
        trim: true,
    }],

    github: {
        type: String,
        default: "",
        trim: true,
    },

    linkedin: {
        type: String,
        default: "",
        trim: true,
    },

    bio: {
        type: String,
        default: "",
        trim: true,
    },

    resume: {
        url: String,
        public_id: String,
        text: {
            type: String,
            default: ""
        }
    },
},

    { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);
