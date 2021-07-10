'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
exports.get = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user._id});
    res.jsonp(user.toJSON());
  } catch (e) {
    res.status(400).send({message: e.message});
  }
};
