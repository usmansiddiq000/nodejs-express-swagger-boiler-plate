"use strict";

/**
 * Module dependencies.
 */
var _ = require("lodash"),
  glob = require("glob");

var getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  var urlRegex = new RegExp("^(?:[a-z]+:)?//", "i");

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map((file) => {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], "");
              }
            }
          } else {
            file = file.replace(excludes, "");
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

exports.getGlobbedPaths = getGlobbedPaths;

exports.assets = {
  routes: ["./src/modules/*/routes/**/*.js"],
  policies: ["./src/modules/*/policies/**/*.js"],
  models: ["./src/modules/*/models/**/*.js"],
  configs: ["./src/modules/*/config/**/*.config.js"],
  sockets: ["./src/modules/*/sockets/**/*.js"],
};
