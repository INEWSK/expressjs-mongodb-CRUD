var express = require("express");
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;

var inventoryController = require("../api/inventory");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", description: "Welcome to EJS" });
});

router.get("/list", inventoryController.list);

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.post("/signup");

router.get("/signin", function (req, res, next) {
  res.render("signin");
});

router.post("/signin");

router.get("/add", function (req, res, next) {
  res.render("add");
});

router.post("/add", inventoryController.add);

module.exports = router;
