'use strict';

/**
 * Module dependencies
 */
const passport = require('passport');
const utils = require('../../../../global-utils');
const path = require('path');

module.exports = (app) => {
  // Initialize strategies
  utils
      .getGlobbedPaths(path.join(__dirname, './strategies/**/*.js'))
      .forEach(function(strategy) {
        passport.use(require(path.resolve(strategy))());
      });

  // Add passport's middleware
  app.use(passport.initialize());
};
