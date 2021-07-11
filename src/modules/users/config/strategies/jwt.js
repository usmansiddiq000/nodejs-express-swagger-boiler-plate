'use strict';

/**
 * Module dependencies
 */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('mongoose').model('User');

module.exports = () => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter('token'),
  ]);
  opts.secretOrKey = 'help-community-secret';

  return new JwtStrategy(opts, (jwtPayload, done) => {
    User.findOne({_id: jwtPayload.id}, '-password -salt', (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });
};
