const User = require("../models/user");
const uploadOnCloudinary = require("../utils/uploadOnCloudinary");
const cloudinary = require("../config/cloudinary");
const extractResumeText = require("../service/resume");


async function handleGetProfile(req, res) {
    try {

        const user = await User.findById(req.user._id).select("-password");

        return res.status(200).json({
            message: "Profile fetched successfully.",
            user,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
}

async function handleUpdateProfile(req, res) {
    try {

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let resume = user.resume; // KEEP OLD RESUME


        // If user uploads a NEW resume
        if (req.file) {

            // Delete old resume from Cloudinary
            if (user.resume?.public_id) {
                await cloudinary.uploader.destroy(
                    user.resume.public_id
                );
            }

            // Upload new resume to Cloudinary
            const result = await uploadOnCloudinary(req.file.buffer);

            // Extract text from the same PDF buffer
            const resumeText = await extractResumeText(req.file.buffer);

            // Store resume details + extracted text
            resume = {
                url: result.secure_url,
                public_id: result.public_id,
                text: resumeText
            };
        }

        const {
            fullName,
            college,
            branch,
            graduationYear,
            skills,
            github,
            linkedin,
            bio
        } = req.body;


        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                fullName,
                college,
                branch,
                graduationYear,
                skills,
                github,
                linkedin,
                bio,
                resume
            },
            { new: true }
        ).select("-password");


        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }



}

module.exports = {
    handleGetProfile,
    handleUpdateProfile,
};