
const mongoose = require("mongoose");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function connectToDB(url) {
    try {
        if (!url) {
            throw new Error("MONGO_URL is missing from .env");
        }

        await mongoose.connect(url);
        console.log("Connection established with DB");
    } catch (err) {
        console.error("Error connecting with DB:", err);
    }
}

module.exports = { connectToDB };
