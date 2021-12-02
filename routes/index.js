var express = require("express");
var router = express.Router();

const db = require("../config/mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/img");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.render("index", {
    title: "Express",
    description: "Welcome to EJS",
  });
});

// user auth
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup");

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin");

// mongodb CRUD
// insert data
router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/create", upload.single("image"), (req, res, next) => {
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
    img64: new Buffer(encode_image, "base64"),
  };

  const obj = {
    item_name: req.body.item_name,
    manager: req.body.manager,
    type: req.body.type,
    quantity: req.body.quantity,
    address: {
      street: req.body.street,
      building: req.body.building,
      country: req.body.country,
      zipcode: req.body.zipcode,
      coordinates: [req.body.lat, req.body.lng],
    },
    image: imgObj,
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
        req.session.message = {
          type: "success",
          title: "Successful",
          message: "Inventory item create successfully!",
        };
        res.redirect("/home");
      }
    );
  });
});

// get all
router.get("/home", (req, res) => {
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
            success: "", // for session message
          });
        }
        client.close;
      });
  });
});

// get a doc details
router.get("/details", (req, res) => {
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
router.get("/edit", (req, res) => {
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
router.post("/update", upload.single("image"), (req, res) => {
  const id = req.query._id;
  const file = req.file;

  var setData = {
    item_name: req.body.item_name,
    manager: req.body.manager,
    type: req.body.type,
    quantity: req.body.quantity,
    address: {
      street: req.body.street,
      building: req.body.building,
      country: req.body.country,
      zipcode: req.body.zipcode,
      coordinates: [req.body.lat, req.body.lng],
    },
  };

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;

    const db = client.db("miniproject_db");
    const whereQuery = { _id: ObjectId(id) };

    if (file) {
      var img = fs.readFileSync(req.file.path);
      var encode_image = img.toString("base64");

      var imgObj = {
        contentType: req.file.mimetype,
        path: req.file.path,
        img64: new Buffer(encode_image, "base64"),
      };
      // insert the new object imgObj into the setData Object
      setData["image"] = imgObj;

      console.log(setData);
    }

    db.collection("inventory").updateOne(
      whereQuery,
      { $set: setData },
      function (err, result) {
        if (err) throw err;
        client.close;
        req.session.message = {
          type: "info",
          title: "Successful",
          message: "Inventory item " + setData.item_name + " is updated!",
        };
        res.redirect("/home");
      }
    );
  });
});

// delete data
router.get("/delete", (req, res) => {
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
