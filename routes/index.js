var express = require("express");
var router = express.Router();

const db = require("../config/mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express",
    description: "Welcome to EJS",
  });
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
  console.log("get create page");
  res.render("create");
});

router.post("/create", function (req, res, next) {
  var myObj = req.body;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory").insertOne(
      myObj,
      {
        safe: true,
      },
      function (err, result) {
        if (err) return console.log(err);
        client.close;
        res.redirect("/home");
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
            inventory: result,
            success: "",
          });
          // res.json(result);
        }
        client.close;
      });
  });
});

// get a doc details
router.get("/details", function (req, res, next) {
  const id = req.query._id;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory")
      .find({
        _id: ObjectId(id),
      })
      .toArray(function (err, result) {
        if (err) throw err;
        res.render("details", {
          path: req.path,
          inventory: result,
        });
        client.close;
      });
  });
});

// show text field data
router.get("/edit", function (req, res) {
  const id = req.query._id;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory")
      .find({
        _id: ObjectId(id),
      })
      .toArray(function (err, result) {
        if (err) throw err;
        res.render("edit", {
          path: req.path,
          inventory: result,
        });
        client.close;
      });
  });
});

// TODO: edit and update data
router.post("/update", function (req, res, next) {
  const id = req.query._id;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;

    const db = client.db("miniproject_db");
    const whereQuery = { _id: ObjectId(id) };
    const setData = { $set: req.body };

    console.log(whereQuery, setData);

    db.collection("inventory").updateOne(
      whereQuery,
      setData,
      function (err, result) {
        if (err) throw err;
        client.close;
        console.log(result);
        res.redirect("/home");
      }
    );
  });
});

// delete data
router.get("/delete", function (req, res, next) {
  const id = req.query._id;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory").deleteOne(
      { _id: ObjectId(id) },
      function (err, result) {
        if (err) throw err;
        client.close;
        console.log(result);
        res.redirect("/home");
      }
    );
  });
});

module.exports = router;
