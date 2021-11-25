var express = require("express");
var router = express.Router();

const db = require("../config/mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", description: "Welcome to EJS" });
});

// user auth
router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup");

router.get("/signin", function (req, res, next) {
  res.render("signin");
});

router.post("/signin");

// mongodb CRUD
// insert data
router.get("/create", function (req, res, next) {
  res.render("create");
});

router.post("/create", function (req, res, next) {
  var myObj = req.body;

  console.log(myObj);

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory").insertOne(
      myObj,
      { safe: true },
      function (err, result) {
        if (err) return console.log(err);
        console.log(`insert doc: ${result}`);
        client.close;
      }
    );
  });
});

// get all
router.get("/home", function (req, res, next) {
  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;

        if (result == null) {
          console.log("No data found");
        } else {
          res.render("home", {
            path: req.path,
            isEmpty: true,
            inventory: result,
          });
          // res.json(result);
        }
        client.close;
      });
  });
});

// get one
router.get("/:name", function (req, res, next) {
  var whereStr = { inv_name: req.params.name };

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory").findOne(whereStr, function (err, result) {
      if (err) throw err;

      if (result == null) {
        res.send("Not Found");
      } else {
        res.json(result);
      }

      client.close;
    });
  });
});

// TODO: update data
router.post("/:name", function (req, res, next) {
  var myObj = req.body;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    // TODO: update method
    db.collection("inventory").updateOne();
  });
});

// TODO: delete data
router.post("/:name", function (req, res, next) {
  var data = req.body;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory").deleteOne();
  });
});

module.exports = router;
