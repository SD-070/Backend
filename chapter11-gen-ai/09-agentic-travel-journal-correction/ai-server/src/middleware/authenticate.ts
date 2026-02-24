import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';

const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
if (!ACCESS_JWT_SECRET) {
  console.log('Missing ACCESS_JWT_SECRET');
  process.exit(1);
}

const authenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.header('authorization');
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (!accessToken) return next();

  try {
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;

    if (!decoded.sub)
      throw new Error('Invalid or expired access token', { cause: { status: 403 } });

    const user = {
      id: decoded.sub,
      roles: decoded.roles
    };

    req.user = user;

    next();
  } catch (error) {
    // if error is an because token was expired, call next with a 401 and `ACCESS_TOKEN_EXPIRED' code
    if (error instanceof jwt.TokenExpiredError) {
      next(
        new Error('Expired access token', {
          cause: { status: 401, code: 'ACCESS_TOKEN_EXPIRED' }
        })
      );
    } else {
      // call next with a new 401 Error indicated invalid access token
      next(new Error('Invalid access token.', { cause: { status: 401 } }));
    }
  }
};

export default authenticate;
