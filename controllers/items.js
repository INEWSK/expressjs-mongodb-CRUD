var express = require("express");

const items = {};
const db = require("../config/mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");

const dbName = "s381f_project";
const collectionName = "inventory";

// CRUD
items.list = (req, res) => {
  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    db.collection(collectionName)
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        console.dir("current session user: " + req.session.user);
        client.close;
        console.dir("is empty?: " + isEmptyObject(result));
        res.render("index", {
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
    const db = client.db(dbName);

    db.collection(collectionName)
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

  var newObj = {
    item_name: req.body.item_name,
    manager: req.body.manager.trim(), // no idea
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
    const db = client.db(dbName);

    if (file) {
      var img = fs.readFileSync(req.file.path);
      var encode_image = img.toString("base64");

      var imgObj = {
        contentType: req.file.mimetype,
        path: req.file.path,
        img64: new Buffer(encode_image, "base64"),
      };

      newObj["image"] = imgObj;
    }

    db.collection(collectionName).insertOne(
      newObj,
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
        res.redirect("/index");
      }
    );
  });
};

items.edit = (req, res) => {
  const id = req.params.id;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    db.collection(collectionName)
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

items.update = (req, res) => {
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
    const db = client.db(dbName);
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

    db.collection(collectionName).updateOne(
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
        res.redirect("/index");
      }
    );
  });
};

items.delete = (req, res) => {
  const id = req.params.id;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    db.collection(collectionName).deleteOne(
      { _id: ObjectId(id) },
      function (err, result) {
        if (err) throw err;
        client.close;
        req.session.message = {
          type: "warning",
          title: "Successfully",
          message: "Item has been removed from list!",
        };
        res.redirect("/index");
      }
    );
  });
};

items.search = (req, res) => {
  var whereQuery;

  MongoClient.connect(db.url, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);

    if (req.params.name) {
      whereQuery = req.params.name.replace(/_/g, " ");
      console.dir("where string is: " + whereQuery);
      db.collection(collectionName)
        .find({
          item_name: whereQuery,
        })
        .toArray((err, result) => {
          if (err) throw err;
          client.close;
          res.json(result);
        });
    } else {
      whereQuery = req.params.type.replace(/_/g, " ");
      db.collection(collectionName)
        .find({
          type: whereQuery,
        })
        .toArray((err, result) => {
          if (err) throw err;
          client.close;
          res.json(result);
        });
    }
  });
};

items.map = (req, res) => {
  const coords = [req.query.lat, req.query.lng];

  res.render("map");
};

module.exports = items;
