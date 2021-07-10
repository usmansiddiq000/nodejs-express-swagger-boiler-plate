"use strict";

/**
 * Module dependencies
 */
const mongoose = require("mongoose"),
  path = require("path"),
  Schema = mongoose.Schema,
  crypto = require("crypto"),
  validator = require("validator"),
  generatePassword = require("generate-password");

/**
 * A Validation function for local strategy properties
 */
const validateLocalStrategyProperty = (property) => {
  return property.length;
};

/**
 * A Validation function for local strategy email
 */
const validateLocalStrategyEmail = (email) => {
  return validator.isEmail(email, { require_tld: false });
};

/**
 * User Schema
 */
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: "",
      validate: [
        validateLocalStrategyProperty,
        "Please fill in your first name",
      ],
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
      validate: [
        validateLocalStrategyProperty,
        "Please fill in your last name",
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
        sparse: true, // For this to work on a previously indexed field, the index must be dropped & the application restarted.
      },
      lowercase: true,
      trim: true,
      default: "",
      validate: [
        validateLocalStrategyEmail,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      default: "",
    },
    salt: {
      type: String,
    },
    profileImageURL: {
      type: String,
      default: "/modules/users/client/img/profile/default.png",
    },
    roles: {
      type: [
        {
          type: String,
          enum: ["user", "patient", "physician", "admin"],
        },
      ],
      default: ["user"],
      required: "Please provide at least one role",
    },
    onlineStatus: {
      status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
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
  { timestamps: true }
);

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre("save", (next) => {
  if (this.password && this.isModified("password")) {
    this.salt = crypto.randomBytes(16).toString("base64");
    this.password = this.hashPassword(this.password);
  }

  this.displayName = this.firstName + " " + this.lastName;
  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre("validate", (next) => {
  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = (password) => {
  if (this.salt && password) {
    return crypto
      .pbkdf2Sync(password, new Buffer(this.salt, "base64"), 10000, 64, "SHA1")
      .toString("base64");
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = (password) => {
  return this.password === this.hashPassword(password);
};

/**
 * Create instance method to remove protected fields from user
 */
UserSchema.methods.toJSON = () => {
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

/**
 * Generates a random passphrase that passes the owasp test
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
 */
UserSchema.statics.generateRandomPassphrase = () => {
  return new Promise(function (resolve, reject) {
    var password = "";
    var repeatingCharacters = new RegExp("(.)\\1{2,}", "g");

    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * 20) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, "");
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    resolve(password);
  });
};
mongoose.model("User", UserSchema);
