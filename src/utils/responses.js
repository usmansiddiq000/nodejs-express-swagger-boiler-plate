'use strict';

exports.handle400 = (res, e = 'Bad Request, Invalid Parameters') => {
  return send(res, 400, {status: false, message: e});
};

exports.handle401 = (res, e = 'Request Unauthenticated') => {
  return send(res, 401, {status: false, message: e});
};

exports.handle404 = (res, e = 'Resource Not Found') => {
  return send(res, 404, {status: false, message: e});
};

exports.handle403 = (res, e = 'Request Unauthorized') => {
  return send(res, 403, {status: false, message: e});
};

exports.handle422 = (res, e = []) => {
  return send(res, 422, {status: false, message: e});
};

exports.handle500 = (res, e = 'Error in completing your request') => {
  console.log(e);
  return send(res, 500, {
    status: false,
    message: e,
  });
};

exports.handle200 = (res, data) => {
  return send(res, 200, {status: true, data});
};

const send = (res, status, data) => {
  return res.status(status).json(data);
};
