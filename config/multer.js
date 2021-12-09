var multer = require("multer");

const whitelist = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
];

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

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(
        new Error("Only .png, .jpg, .jpeg, .gif or .webp format allowed!")
      );
    } else {
      cb(null, true);
    }
  },
});

module.exports = {
  upload,
};
