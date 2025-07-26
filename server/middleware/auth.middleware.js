const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model.js');
// asyncHandler only catches promise-based errors, not synchronous ones unless they're awaited.

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //If this syncronous line throws (bad token), the error is not caught by asyncHandler, and Express will crash or skip the proper 401 response.
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };


//Even when using express-async-handler, any synchronous errors (like JWT verification) must be manually wrapped in a try/catch block to ensure proper error handling and response — especially in authentication middleware.

//In Express.js, next() is used inside middleware to signal that the middleware has finished its task and control should be passed to the next function in the stack — either another middleware or the final route handler. If we call next(error), it forwards the error to the global error-handling middleware.