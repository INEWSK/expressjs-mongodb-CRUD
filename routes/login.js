var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    res.render("login");
    // var username = req.body.username;
    // var password = req.body.password;

    // console.log(`the username is ${username}, and password ${password}.`)
});

module.exports = router;