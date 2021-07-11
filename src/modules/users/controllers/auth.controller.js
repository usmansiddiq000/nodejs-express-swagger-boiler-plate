'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const {
  handle404,
  handle200,
  handle401,
  handle500,
} = require('../../../utils/responses');

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
        {expiresIn: '2 days'},
    );
    handle200(res, {token, expiry: moment().add(2, 'days').unix()});
  } catch (e) {
    return handle500(res);
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      active: true,
      email: req.body.email,
    });
    if (!user) return handle404(res);
    const authenticated = user.authenticate(req.body.password);
    if (!authenticated) return handle401(res);
    const token = jwt.sign(
        {
          id: user._id,
          displayName: user.displayName,
          email: user.email,
          roles: user.roles,
        },
        'help-community-secret',
        {expiresIn: '2 days'},
    );
    handle200(res, {token, expiry: moment().add(2, 'days').unix()});
  } catch (e) {
    return handle500(res);
  }
};
