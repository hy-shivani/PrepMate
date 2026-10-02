const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;



function setUser(user) {
    return jwt.sign({

        "_id": user._id,

    }, secret);
}


function getUser(token) {
    if (!token) return null;
    return jwt.verify(token, secret);
}

module.exports = {
    setUser, getUser,
}