const Interview = require("../models/interview");
const User = require("../models/user");

async function handleDashboard(req, res) {
    try {
        const loggedInUser = await User.findById(req.user._id).select("-password");

        if (!loggedInUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const interviews = await Interview.find({
            user: req.user._id,
            status: "Completed",
        }).sort({ createdAt: -1 });

        const totalInterviews = interviews.length;

        let bestScore = 0;
        let totalScore = 0;


        for (const interview of interviews) {
            let score = 0;

            if (interview.interviewMode === "Aptitude") {
                score = interview.scores.aptitude ?? 0;
            } else if (interview.interviewMode === "Technical") {
                score = interview.scores.technical ?? 0;
            } else if (interview.interviewMode === "HR") {
                score = interview.scores.hr ?? 0;
            }

            bestScore = Math.max(bestScore, score);
            totalScore += score;
        }

        let averageScore = 0;

        if (totalInterviews > 0) {
            averageScore = Number((totalScore / totalInterviews).toFixed(2));
        }

        const recentInterviews = interviews.slice(0, 5);

        return res.status(200).json({
            fullName: loggedInUser.fullName,
            email: loggedInUser.email,

            totalInterviews,
            bestScore,
            averageScore,

            recentInterviews,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
}

module.exports = {
    handleDashboard,
};