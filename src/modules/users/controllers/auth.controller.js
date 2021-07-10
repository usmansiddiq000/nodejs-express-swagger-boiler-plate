'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.signup = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign(
        {
          id: user._id,
          displayName: user.displayName,
          email: user.email,
          roles: user.roles,
        },
        'help-community-secret',
    );
    return res.jsonp({token, expiry: moment().add(2, 'days').unix()});
  } catch (e) {
    return res.status(400).send({message: e.message});
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      active: true,
      email: req.body.email,
    });
    if (user) {
      const authenticated = user.authenticate(req.body.password);
      if (authenticated) {
        // Generate a webtoken
        const token = jwt.sign(
            {
              id: user._id,
              displayName: user.displayName,
              email: user.email,
              roles: user.roles,
            },
            'help-community-secret',
        );
        res.jsonp({token, expiry: moment().add(2, 'days').unix()});
      } else {
        res.status(400).send({message: 'Wrong password'});
      }
    } else {
      res.status(400).send({message: 'User does not exist'});
    }
  } catch (e) {
    res.status(400).send({message: e.message});
  }
};
