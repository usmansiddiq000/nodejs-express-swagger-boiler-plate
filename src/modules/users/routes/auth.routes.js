const authController = require("../controllers/auth.controller"),
  { validationSchema } = require("../validators/auth.validator"),
  { validate } = require("../../../utils/validate");

module.exports = function (app) {
  app
    .route("/api/auth/signup")
    .all([validationSchema("signup"), validate])
    .post(authController.signup);
  app
    .route("/api/auth/signin")
    .all([validationSchema("signin"), validate])
    .post(authController.signin);
};
