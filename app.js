var createError = require("http-errors");
var express = require("express");
var expressLayouts = require("express-ejs-layouts");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var session = require("express-session");

var mongodb = require("./config/mongodb");
var app = express();

// const PORT = process.env.PORT || 3000;

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("cookie cat"));
// session settings
app.use(
  session({
    secret: "secret key here",
    saveUninitialized: true,
    name: "token",
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // one day
    rolling: true,
  })
);

// session check
app.use((req, res, next) => {
  const { authenticated } = req.session;
  if (req.url !== "/signin" && req.url !== "/signup") {
    if (!authenticated) {
      res.redirect("/signin");
    } else {
      next();
    }
  } else {
    next();
  }
});

// session flash message
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// load assets
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/img", express.static(path.join(__dirname, "public/img")));
app.use("/uploads/img", express.static(path.join(__dirname, "uploads/img")));

// import routes
var index = require("./routes/index");
var auth = require("./routes/auth");
var inventory = require("./routes/inventory");

// load routes
// 根據 app.use 順序優先加載, 如 index.js 沒有對應 URL 再往下尋找
app.use("/", index);
app.use("/", auth);
app.use("/", inventory);

// connect mongodb
mongodb.connect();

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
// app.listen(PORT, () => {
//   console.log(`app listening at: http://localhost:${PORT}`);
// });

module.exports = app;
