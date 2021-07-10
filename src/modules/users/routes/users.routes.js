const userPolicies = require("../policies/users.policies"),
  userController = require("../controllers/user.controller");

module.exports = function (app) {
  app.route("/api/user").all(userPolicies.isAllowed).get(userController.get);
};
