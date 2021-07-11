'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const {handle404, handle200, handle500} = require('../../../utils/responses');
exports.get = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user._id});
    if (!user) return handle404(res);
    handle200(res, user.toJSON());
  } catch (e) {
    return handle500(res);
  }
};
