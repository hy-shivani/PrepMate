const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Multer stores the complete uploaded file in a Buffer (RAM).
// createReadStream() reads that Buffer chunk by chunk,
// and pipe() sends those chunks sequentially to Cloudinary.

/*
Multer receives the uploaded file and stores it as a Buffer in RAM, streamifier converts
 that Buffer into a readable stream, and the stream is piped to Cloudinary, which uploads
 the file and returns its details such as the secure_url, which we can then store in MongoDB.*/

function uploadOnCloudinary(buffer) {
    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto", // Automatically detects the file type
                folder: "PrepMate",   // Stores the file in the PrepMate folder on Cloudinary
            },
            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve(result);

                //result contents
                /*{ 
                    asset_id: "...",
                    public_id: "...",
                    secure_url: "...",
                    url: "...",
                    created_at: "...",
                    bytes: 361538,
                    format: "pdf",
                    ...
                }
                
                is Cloudinary's response object.
                
                Cloudinary is saying:
                
                "I have successfully uploaded your file. Here are the details."*/
            }
        );

        streamifier
            .createReadStream(buffer) // converts buffer into stream data
            .pipe(uploadStream);  //sends the stream to Cloudinary.

    });
}

module.exports = uploadOnCloudinary;