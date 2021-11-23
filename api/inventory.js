const inventory = {};
const db = require("../config/mongodb");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

// list all
inventory.list = (req, res) => {
  MongoClient.connect(db.url, (err, client) => {
    if (err) return console.log(err);
    const db = client.db("miniproject_db");

    db.collection("inventory")
      .find()
      .toArray()
      .then(function (docs) {
        client.close();
        res.send(docs);
      });
  });
};

// add docs
inventory.add = (req, res) => {
  var data = req.body;
  MongoClient.connect(db.url, (err, client) => {
    if (err) return console.log(err);
    const db = client.db("miniproject_db");

    db.collection("inventory").insertOne(
      data,
      { safe: true },
      function (err, result) {
        if (err) return console.log(err);
        client.close;
        console.log(`insert doc: ${result}`);
        res.redirect("/");
      }
    );
  });
};

module.exports = inventory;
