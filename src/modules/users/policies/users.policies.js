'use strict';

/**
 * Module dependencies
 */
const acl = require('acl');
const passport = require('passport');

// eslint-disable-next-line new-cap
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Estimates Permissions
 */
exports.invokeRolesPolicies = () => {
  acl.allow([
    {
      roles: ['user', 'admin'],
      allows: [
        {
          resources: '/api/user',
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
        const roles = user && user.roles ? user.roles : ['guest'];
        req.user = user;
        // Check for user roles
        acl.areAnyRolesAllowed(
            roles,
            req.route.path,
            req.method.toLowerCase(),
            (err, isAllowed) => {
              if (err) {
                // An authorization error occurred
                return res.status(500).send('Unexpected authorization error');
              } else {
                if (isAllowed) {
                  // Access granted! Invoke next middleware
                  return next();
                } else {
                  // if not authenticated, send 401
                  if (!user) {
                    return res.status(401).json({
                      message: 'User is not authorized',
                    });
                  }
                  // else send 403
                  return res.status(403).json({
                    message: 'User is not authorized',
                  });
                }
              }
            },
        );
      },
  )(req, res, next);
};
