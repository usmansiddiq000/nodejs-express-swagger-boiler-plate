'use strict';

/**
 * Module dependencies.
 */
const _ = require('lodash');
const glob = require('glob');

const getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  const urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

  // The output array
  let output = [];

  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map((file) => {
          if (_.isArray(excludes)) {
            for (const i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
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
  routes: ['./src/modules/*/routes/**/*.js'],
  policies: ['./src/modules/*/policies/**/*.js'],
  models: ['./src/modules/*/models/**/*.js'],
  configs: ['./src/modules/*/config/**/*.config.js'],
  sockets: ['./src/modules/*/sockets/**/*.js'],
  controllers: ['./src/modules/*/controllers/**/*.js'],
};
