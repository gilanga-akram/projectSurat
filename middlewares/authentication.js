const { users } = require('../models');
const { verifyToken } = require('../helpers/jwt');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
 
const authentication = async(req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) throw createError(StatusCodes.UNAUTHORIZED, 'You have to login first');
    const decoded = verifyToken(token);
    const registeredUserAdmin = await users.findOne({ where: { user_id: decoded.user_id } });
    if (!registeredUserAdmin) throw createError(StatusCodes.UNAUTHORIZED, 'You have to login first');
    req.UserData = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;