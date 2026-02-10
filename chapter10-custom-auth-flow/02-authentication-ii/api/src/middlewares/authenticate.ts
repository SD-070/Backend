//will need to install jwt library
// add same secret as auth server to .env variables

import type { RequestHandler } from 'express';

const authenticate: RequestHandler = (req, _res, next) => {
  // verify the token, similar to me endpoint, including error handling with try/catch
  // use updated errorHandler for WWW-authenticate header
  // add user.sub (user's _id) to the request body
  next();
};

export default authenticate;
