//The .v2 means we're using the version 2 API provided by the SDK.
const cloudinary = require("cloudinary").v2;

//Connect me to my Cloudinary account.
//This file is basically setting up the connection
//  between your Node/Express application and your Cloudinary account.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;