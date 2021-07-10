var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var util = require("./global-utils");
var cors = require("cors");
require("dotenv").config();

var allRoutes = util.getGlobbedPaths(util.assets.routes);
var allPolicies = util.getGlobbedPaths(util.assets.policies);
var allModels = util.getGlobbedPaths(util.assets.models);
var allConfigs = util.getGlobbedPaths(util.assets.configs);

var app = express();
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "src/modules/core/views"));
app.set("view engine", "hbs");

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

allPolicies.forEach((element) => {
  require(element).invokeRolesPolicies();
});

const connection = mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db", process.env.MONGO_URI);
    allModels.forEach((element) => {
      require(element);
    });

    allConfigs.forEach((element) => {
      require(element)(app);
    });

    allRoutes.forEach((element) => {
      require(element)(app);
    });

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      next(createError(404));
    });
    // error handler
    app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

connection.on;

module.exports = app;

// error handling via utilities
// swagger
