'use strict';

/**
 * Module dependencies
 */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('mongoose').model('User');
const fs = require('fs');
const publicKey = fs.readFileSync('./keys/public.key', 'utf8');

module.exports = () => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter('token'),
  ]);
  opts.secretOrKey = publicKey;
  opts.algorithms = ['RS256'];

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
