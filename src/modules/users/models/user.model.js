/* eslint-disable no-invalid-this */
'use strict';

/**
 * Module dependencies
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const validator = require('validator');
const generatePassword = require('generate-password');

const validateLocalStrategyProperty = function(property) {
  return property.length;
};

const validateLocalStrategyEmail = function(email) {
  return validator.isEmail(email, {require_tld: false});
};

/**
 * User Schema
 */
const UserSchema = new Schema(
    {
      firstName: {
        type: String,
        trim: true,
        default: '',
        validate: [
          validateLocalStrategyProperty,
          'Please fill in your first name',
        ],
      },
      lastName: {
        type: String,
        trim: true,
        default: '',
        validate: [
          validateLocalStrategyProperty,
          'Please fill in your last name',
        ],
      },
      displayName: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        index: {
          unique: true,
        },
        lowercase: true,
        trim: true,
        default: '',
        validate: [
          validateLocalStrategyEmail,
          'Please fill a valid email address',
        ],
      },
      password: {
        type: String,
        default: '',
      },
      salt: {
        type: String,
      },
      profileImageURL: {
        type: String,
        default: '/modules/users/client/img/profile/default.png',
      },
      roles: {
        type: [
          {
            type: String,
            enum: ['user', 'patient', 'physician', 'admin'],
          },
        ],
        default: ['user'],
        required: 'Please provide at least one role',
      },
      onlineStatus: {
        status: {
          type: String,
          enum: ['online', 'offline'],
          default: 'offline',
        },
        socket: String,
      },
      resetPasswordToken: {
        type: String,
      },
      resetPasswordExpires: {
        type: Date,
      },
      /* more personal information */
      specialty: {
        type: String,
      },
      prefferedLanguage: {
        type: String,
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
    {timestamps: true},
);

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  this.displayName = this.firstName + ' ' + this.lastName;
  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function(next) {
  next();
});

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

UserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto
        .pbkdf2Sync(
            password,
            // eslint-disable-next-line new-cap
            new Buffer.alloc(512, this.salt, 'base64'), 10000, 64, 'SHA1')
        .toString('base64');
  } else {
    return password;
  }
};


UserSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    displayName: this.displayName,
    email: this.email,
    profileImageURL: this.profileImageURL,
    roles: this.roles,
  };
};

UserSchema.statics.generateRandomPassphrase = function() {
  return new Promise(function(resolve, reject) {
    let password = '';
    const repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * 20) + 20,
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    resolve(password);
  });
};
mongoose.model('User', UserSchema);
