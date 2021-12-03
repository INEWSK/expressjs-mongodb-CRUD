var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();

const users = {};

const accounts = [
  { username: "demo", password: "" },
  { username: "admin", password: "admin" },
  { username: "developer", password: "developer" },
  { username: "guest", password: "guest" },
];

users.create = (req, res) => {
  req.session.message = {
    type: "success",
    title: "Your user registration was successful.",
    message: "You may now sign-in with the username you have chosen",
  };
  res.redirect("/signin");
};

users.signin = async (req, res) => {
  const { username, password } = req.body;

  const user = await findUser(username, password);

  if (user) {
    req.session.message = {
      type: "success",
      title: "Login successful",
      message: "You are successfully logged in.",
    };
    req.session.authenticated = true;
    req.session.user = user.username;
    res.redirect("/home");
  } else {
    req.session.message = {
      type: "negative",
      title: "Login Failed",
      message: "Your user ID or password is incorrect.",
    };
    res.redirect("/signin");
  }
};

users.signout = (req, res) => {
  req.session.destroy();
  req.session.message = {
    type: "success",
    title: "Logout successful",
    message: "You've been logged out. Please sign-in again.",
  };
  res.redirect("/signin");
};

findUser = (username, password) => {
  let user = {};
  for (var i = 0; i < accounts.length; i++) {
    if (username == accounts[i].username) {
      if (password == accounts[i].password) {
        return (user = accounts[i]);
      }
    }
  }
  return false;
};

module.exports = users;
