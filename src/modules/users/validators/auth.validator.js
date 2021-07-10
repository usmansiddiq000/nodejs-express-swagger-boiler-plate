const mongoose = require('mongoose');
const User = mongoose.model('User');
const {body} = require('express-validator');

exports.validationSchema = (method) => {
  switch (method) {
    case 'signup': {
      return [
        body('firstName')
            .exists({checkFalsy: true})
            .withMessage('firstName is required')
            .bail()
            .isLength({max: 25})
            .withMessage('firstName max length should be 25 characters')
            .trim(),
        body('lastName')
            .exists({checkFalsy: true})
            .withMessage('lastName is required')
            .bail()
            .isLength({max: 25})
            .withMessage('lastName max length should be 25 characters')
            .trim(),
        body('email')
            .exists({checkFalsy: true})
            .withMessage('email is required')
            .bail()
            .isEmail()
            .withMessage('email is invalid')
            .bail()
            .trim()
            .normalizeEmail()
            .custom(async (value) => {
              const user = await User.findOne({email: value});
              if (user) {
                return Promise.reject(new Error('user exists'));
              }
            })
            .bail(),
        body('password')
            .exists({checkFalsy: true})
            .withMessage('password is required')
            .bail()
            .isLength({min: 6, max: 20})
            .withMessage('password must be 6 - 20 characters')
            .bail()
            .custom(async (value) => {
              if (!/^[A-Za-z0-9]+$/i.test(value)) {
                return Promise.reject(
                    new Error('password must be (A-Z, a-z, 0-9 only)'),
                );
              }
            })
            .trim(),
      ];
    }
    case 'signin': {
      return [
        body('email')
            .exists({checkFalsy: true})
            .withMessage('email is required')
            .bail()
            .isEmail()
            .withMessage('email is invalid')
            .trim()
            .normalizeEmail(),
        body('password')
            .exists({checkFalsy: true})
            .withMessage('password is required')
            .bail()
            .isLength({min: 6, max: 20})
            .withMessage('password must be 6 - 20 characters')
            .bail()
            .custom(async (value) => {
              if (!/^[A-Za-z0-9]+$/i.test(value)) {
                return Promise.reject(
                    new Error('password must be (A-Z, a-z, 0-9 only)'),
                );
              }
            })
            .trim(),
      ];
    }
  }
};
