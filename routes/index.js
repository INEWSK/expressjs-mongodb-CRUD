var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  console.log("is user authenticated?: " + req.session.authenticated);
  if (!req.session.authenticated) {
    // user not logged in!
    res.redirect("/signin");
  } else {
    res.redirect("/home");
  }
});

module.exports = router;
