'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const {handle404, handle200, handle500} = require('../../../utils/responses');

/**
 * @swagger
 *  /api/user:
 *    get:
 *      tags:
 *        - Users
 *      security:
 *        - bearerAuth: []
 *      summary: Retrieve a single user.
 *      description: Retrieve a single user.Can be used to populate a user profile.
 *      responses:
 *        200:
 *          description: A single user.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
exports.get = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user._id});
    if (!user) return handle404(res);
    handle200(res, user);
  } catch (e) {
    return handle500(res);
  }
};

/**
 * @swagger
 *  /api/users:
 *    get:
 *      tags:
 *        - Users
 *      security:
 *        - bearerAuth: []
 *      summary: Retrieve a All users.
 *      description: Retrieve a All user.
 *      responses:
 *        200:
 *          description: All user.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Users'
 */
exports.getAll = async (req, res) => {
  try {
    const users = await User.find({active: true});
    if (!users) return handle404(res);
    handle200(res, users);
  } catch (e) {
    return handle500(res);
  }
};
/**
 * @swagger
 *  components:
 *     schemas:
 *      Users:
 *        type: object
 *        properties:
 *          status:
 *            type: boolean
 *            description: response status
 *            example: true
 *          data:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/UserSchema'
 *      User:
 *        type: object
 *        properties:
 *          status:
 *            type: boolean
 *            description: response status
 *            example: true
 *          data:
 *            type: object
 *            $ref: '#/components/schemas/UserSchema'
 *      UserSchema:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: The user ID.
 *            example: 0
 *          firstName:
 *            type: string
 *            description: The user's first name.
 *            example: jhon
 *          lastName:
 *            type: string
 *            description: The users's last name
 *            example: doe
 *          displayName:
 *            type: string
 *            description: The user's display name
 *            example: jhon doe
 *          email:
 *            type: email
 *            description: The user's email
 *            example: jhondoe@gmail.com
 *          profileImageURL:
 *            type: string
 *            description: the user's profile image
 *            example: https://abc.com/jhon.png
 *          roles:
 *            type: array
 *            description: user's roles
 *            example: ['user','admin']
 */

