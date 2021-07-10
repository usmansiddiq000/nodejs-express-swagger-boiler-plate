"use strict";

/**
 * Module dependencies
 */
const passport = require("passport"),
  utils = require("../../../../global-utils"),
  path = require("path");

/**
 * Module init function
 */
module.exports = (app) => {
  // Initialize strategies
  utils
    .getGlobbedPaths(path.join(__dirname, "./strategies/**/*.js"))
    .forEach(function (strategy) {
      passport.use(require(path.resolve(strategy))());
    });

  // Add passport's middleware
  app.use(passport.initialize());
};
