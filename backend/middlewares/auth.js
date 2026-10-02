const { getUser } = require("../service/auth");

// Authentication Middleware
function restrictToLoggedInUser(req, res, next) {

    const token = req.cookies.uid;

    if (!token) {
        return res.status(401).json({
            message: "Please login first.",
        });
    }

    const user = getUser(token);

    if (!user) {
        return res.status(401).json({
            message: "Invalid or expired token.",
        });
    }

    req.user = user;

    next();
}

// Authorization Middleware
// roles are not restricted roles
function restrictTo(roles = []) {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access Denied.",
            });
        }

        next();
    };

}

module.exports = {
    restrictToLoggedInUser,
    restrictTo,
};