"use strict";

/**
 * Module dependencies
 */
const passport = require("passport"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt,
  User = require("mongoose").model("User");

module.exports = () => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter("token"),
  ]);
  opts.secretOrKey = "help-community-secret";

  return new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.id }, "-password -salt", (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  });
};
