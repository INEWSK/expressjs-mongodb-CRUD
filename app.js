var createError = require("http-errors");
var express = require("express");
var expressLayouts = require("express-ejs-layouts");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var mongodb = require("./config/mongodb");
var app = express();
var db;

const port = process.env.port || 3030;

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// load assets
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/img", express.static(path.join(__dirname, "public/img")));

// load bootstrap
app.use(express.static(__dirname + "/node_modules/bootstrap/dist/css"));

// import routes
var index = require("./routes/index");

// load routes
app.use("/", index);
// app.use("/inventory", inventory);
// app.use("/auth", auth);

// connect mongodb
mongodb.connect();

// make db accessible to router
app.use(function (req, res, next) {
  req.db = db;
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// create server
app.listen(port, () => {
  console.log(`app listening at port: ${port}`);
});

module.exports = app;
