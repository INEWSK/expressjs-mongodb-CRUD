var express = require("express");
var router = express.Router();
var userController = require("../controllers/users");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", userController.create);

router.get("/signin", (req, res) => {
  res.render("signin", {
    path: req.path,
    success: "",
  });
});

router.post("/signin", userController.signin);

router.get("/signout", userController.signout);

module.exports = router;
