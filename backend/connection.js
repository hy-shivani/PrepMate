const mongoose = require("mongoose");

async function connectToDB(url) {
    return mongoose.connect(url).
        then(() => { console.log("connection established with db"); }).
        catch(() => { console.log("error connecting with db"); })
}

module.exports = { connectToDB };