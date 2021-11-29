var express = require("express");
var router = express.Router();

const db = require("../config/mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/", function (req, res) {
  res.render("index", {
    title: "Express",
    description: "Welcome to EJS",
  });
});

// user auth
router.get("/signup", function (req, res) {
  res.render("signup");
});

router.post("/signup");

router.get("/signin", function (req, res) {
  res.render("signin");
});

router.post("/signin");

// mongodb CRUD
// insert data
router.get("/create", function (req, res) {
  res.render("create");
});

router.post("/create", upload.single("image"), function (req, res, next) {
  const file = req.file;

  if (!file) {
    const error = new Error("Please upload image file.");
    error.httpStatusCode = 400;
    return next(error);
  }

  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString("base64");

  var imgObj = {
    contentType: req.file.mimetype,
    path: req.file.path,
    image: new Buffer(encode_image, "base64"),
  };

  const obj = {
    item_name: req.body.item,
    manager: req.body.username,
    type: req.body.type,
    quantity: req.body.quantity,
    address: {
      street: req.body.street,
      building: req.body.building,
      country: req.body.country,
      postcode: req.body.postcode,
      coordinate: [req.body.lat, req.body.lng],
    },
    img: imgObj,
  };

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory").insertOne(
      obj,
      {
        safe: true,
      },
      function (err, result) {
        if (err) throw err;
        client.close;
        res.redirect("/home");
      }
    );
  });
});

// get all
router.get("/home", function (req, res) {
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
            documents: result,
            success: "",
          });
          // res.json(result);
        }
        client.close;
      });
  });
});

// get a doc details
router.get("/details", function (req, res) {
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
          documents: result,
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
          documents: result,
        });
        client.close;
      });
  });
});

// edit and update data
router.post("/update", function (req, res) {
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
router.get("/delete", function (req, res) {
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
