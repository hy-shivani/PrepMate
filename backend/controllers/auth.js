

const { setUser } = require("../service/auth");

const User = require("../models/user");

async function handleSignUP(req, res) {

    const { fullName, email, password } = req.body;

    const user = await User.create({
        fullName, email, password
    });

    res.send("signed up successfuly");
    //redirect to dashboard or login

}

async function handleLogin(req, res) {

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(401).send("invalid email or password");
    }

    //jwt

    const token = setUser(user);
    res.cookie("uid", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.send("logged in successfuly");

    //redirect to dashboard
}

async function handleLogout(req, res) {

    res.clearCookie("uid");
    res.send("Logged Out successfuly");
}


module.exports = {
    handleSignUP, handleLogin, handleLogout
}