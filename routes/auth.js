var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;

const users = [];

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup");

router.get("/signin", function (req, res, next) {
  res.render("signin");
});

// router.post("/", async function (req, res) {
//   console.log(req.body.username);
//   // process username and password
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     users.push({
//       id: Date.now().toString(),
//       username: req.body.username,
//       password: hashedPassword,
//     });

//     var db = req.db;
//     var collection = db.collection("auth");

//     collection.insertOne(users, function (err, res) {
//       if (err) {
//         console.log(err);
//       }
//       res.redirect("/signin");
//     });
//   } catch (error) {
//     console.log(error);
//     res.redirect("/");
//   }
//   console.log(users);
// });

module.exports = router;
