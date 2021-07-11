'use strict';

const userPolicies = require('../policies/users.policies');
const userController = require('../controllers/user.controller');

module.exports = function(app) {
  app.route('/api/user').all(userPolicies.isAllowed)
      .get(userController.get);

  app.route('/api/users').all(userPolicies.isAllowed)
      .get(userController.getAll);
};
