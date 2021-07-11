'use strict';

let acl = require('acl');
const passport = require('passport');
const {
  handle401,
  handle500,
  handle403,
} = require('../../../utils/responses');

// eslint-disable-next-line new-cap
acl = new acl(new acl.memoryBackend());


exports.invokeRolesPolicies = () => {
  acl.allow([
    {
      roles: ['user', 'admin'],
      allows: [
        {
          resources: '/api/user',
          permissions: '*',
        },
        {
          resources: '/api/users',
          permissions: '*',
        },
      ],
    },
  ]);
};

exports.isAllowed = (req, res, next) => {
  passport.authenticate(
      'jwt',
      {session: false},
      (err, user, info, status) => {
        if (info) return handle401(res, 'Invalid Token');
        req.user = user;
        const roles = user && user.roles ? user.roles : ['guest'];
        acl.areAnyRolesAllowed(
            roles,
            req.route.path,
            req.method.toLowerCase(),
            (err, isAllowed) => {
              if (err) {
                return handle500(res);
              } else {
                if (isAllowed) {
                  return next();
                } else {
                  if (!user) return handle401(res);
                  return handle403(res);
                }
              }
            },
        );
      },
  )(req, res, next);
};

