require("dotenv").config();
const cors = require("cors");
const multer = require("multer");



const cookieParser = require("cookie-parser");
const express = require("express");

const { connectToDB } = require("./connection");
const authRouter = require("./routes/auth");
const interviewRouter = require("./routes/interview");
const profileRouter = require("./routes/profile");
const dashboardRouter = require("./routes/dashboard");

const app = express();

//connection
connectToDB(process.env.MONGO_URL);

//middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

//Allows a frontend from one origin (domain/port) to access a backend on another origin
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


//routes
app.use("/auth", authRouter);
app.use("/interviews", interviewRouter);
app.use("/profile", profileRouter);
app.use("/dashboard", dashboardRouter);



app.listen(process.env.PORT, () => { console.log("server started") });


