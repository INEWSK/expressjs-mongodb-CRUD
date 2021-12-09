var multer = require("multer");

// to store file locally
// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads/img");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// for get buffer into database only and process multipart form
var storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
