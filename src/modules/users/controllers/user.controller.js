"use strict";

var mongoose = require("mongoose"),
  User = mongoose.model("User"),
  { isEmpty } = require("lodash");
exports.get = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.jsonp(user.toJSON());
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};
