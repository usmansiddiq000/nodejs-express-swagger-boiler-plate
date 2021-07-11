'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const {
  handle404,
  handle200,
  handle401,
  handle500,
} = require('../../../utils/responses');

/**
 * @swagger
 *  /api/signup:
 *    post:
 *      tags:
 *        - Auth
 *      security:
 *        []
 *      summary: user signup.
 *      description: signup user.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string
 *                  description: user first name
 *                  example: jhon
 *                lastname:
 *                  type: string
 *                  description: user first name
 *                  example: doe
 *                email:
 *                  type: email
 *                  description: user email
 *                  example: jhondoe@g.com
 *                password:
 *                  type: string
 *                  description:  user's password
 *                  example: abc234A
 *      responses:
 *        200:
 *          description: User signin.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: signin token
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6I
 *                  expiry:
 *                    type: number
 *                    description:  expiry tie in milliseconds (unix)
 *                    example: 1626114011
 */

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
        privateKey,
        {
          expiresIn: '2 days',
          algorithm: 'RS256',
        },
    );
    handle200(res, {token, expiry: moment().add(2, 'days').unix()});
  } catch (e) {
    return handle500(res);
  }
};


/**
 * @swagger
 *  /api/signin:
 *    post:
 *      tags:
 *        - Auth
 *      security:
 *        []
 *      summary: user signin.
 *      description: signin user.
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: email
 *                  description: user email
 *                  example: jhondoe@g.com
 *                password:
 *                  type: string
 *                  description:  user's password
 *                  example: abc234A
 *      responses:
 *        200:
 *          description: User signin.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: signin token
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6I
 *                  expiry:
 *                    type: number
 *                    description:  expiry tie in milliseconds (unix)
 *                    example: 1626114011
 */

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
        privateKey,
        {
          expiresIn: '2 days',
          algorithm: 'RS256',
        },
    );
    handle200(res, {token, expiry: moment().add(2, 'days').unix()});
  } catch (e) {
    return handle500(res);
  }
};
