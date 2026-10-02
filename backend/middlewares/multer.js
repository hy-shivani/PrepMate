const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;


//Multer is middleware that parses multipart/form-data so your Express route can conveniently access uploaded files through req.file / req.files.

//And because you're using memoryStorage(), the file isn't saved to disk.
//  It's kept in RAM as a Buffer.