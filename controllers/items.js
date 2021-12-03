var express = require("express");
var router = express.Router();

const items = {};
const db = require("../config/mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");

// CRUD
items.list = (req, res) => {
  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        console.dir("current session user: " + req.session.user);
        client.close;
        res.render("home", {
          path: req.path,
          documents: result,
          currentUser: req.session.user,
          success: "", // for session message
        });
      });
  });
};

items.details = (req, res) => {
  const id = req.params.id;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory")
      .find({
        _id: ObjectId(id),
      })
      .toArray(function (err, result) {
        if (err) throw err;
        client.close;
        res.render("details", {
          path: req.path,
          documents: result,
          currentUser: req.session.user,
        });
      });
  });
};

items.insert = (req, res, next) => {
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
    manager: req.body.manager.trim(),
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
          title: "Successfully",
          message: "Item create successfully!",
        };
        res.redirect("/home");
      }
    );
  });
};

items.edit = (req, res) => {
  const id = req.params.id;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory")
      .find({
        _id: ObjectId(id),
      })
      .toArray(function (err, result) {
        if (err) throw err;
        client.close;
        res.render("edit", {
          path: req.path,
          documents: result,
        });
      });
  });
};

items.update = (req, res, next) => {
  const id = req.params.id;
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
          message: "Item " + setData.item_name + " is updated!",
        };
        res.redirect("/home");
      }
    );
  });
};

items.delete = (req, res) => {
  const id = req.params.id;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db("miniproject_db");

    db.collection("inventory").deleteOne(
      { _id: ObjectId(id) },
      function (err, result) {
        if (err) throw err;
        client.close;
        req.session.message = {
          type: "warning",
          title: "Successfully",
          message: "Item has been removed from list!",
        };
        res.redirect("/home");
      }
    );
  });
};

module.exports = items;
