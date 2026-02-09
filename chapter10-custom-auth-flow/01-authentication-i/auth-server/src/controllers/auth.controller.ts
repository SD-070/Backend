import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_JWT_SECRET, REFRESH_TOKEN_TTL, SALT_ROUNDS, ACCESS_TOKEN_TTL } from '#config';
import { User, RefreshToken } from '#models';

export const register: RequestHandler = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const userExists = await User.exists({ email });
  if (userExists) throw new Error('Email already registered', { cause: { status: 409 } });

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPW = await bcrypt.hash(password, salt);

  const user = await User.create({ email, password: hashedPW, firstName, lastName });

  const payload = { roles: user.roles };
  const secret = ACCESS_JWT_SECRET;
  const tokenOptions = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: user._id.toString()
  };

  const accessToken = jwt.sign(payload, secret, tokenOptions);

  const refreshToken = randomUUID();

  await RefreshToken.create({
    token: refreshToken,
    userId: user._id
  });

  res.status(201).json({ message: 'Registered', accessToken, refreshToken });
};

export const login: RequestHandler = async (req, res) => {
  // get email and password from request body
  //
  // query the DB to find user with that email
  //
  // if not user is found, throw a 401 error and indicate invalid credentials
  //
  // compare the password to the hashed password in the DB with bcrypt
  // const match = await bcrypt.compare(password, user.password);
  //
  // if match is false, throw a 401 error and indicate invalid credentials
  //
  // delete all Refresh Tokens in DB where userId is equal to _id of user
  //
  // generate refresh and access tokens
  //
  // send generic success message, refreshToken, and accessToken in body of response
};

export const refresh: RequestHandler = async (req, res) => {
  // TODO: Implement access token refresh and refresh token rotation
  // Get the refresh token from the cookies and verify it
  // Look up the refresh token in the database, throw and error, if it canot be found
  // delete the old refresh token, look up the user and issue new tokens
  // store the new refresh token in your db and send both access and refresh token via cookies
};

export const logout: RequestHandler = async (req, res) => {
  // TODO: Implement logout by removing the tokens
  // Get the tokens from the cookies
  // Delete the refresh token from your database
  // Clear both cookies
  // A longer living access token, or a token in a higher risk use case would need to be put on a token blacklist - another entry in your db - and checked on validation
  // Since our access tokens are valid for a couple of minutes the risk here is acceptable
};

export const me: RequestHandler = async (req, res, next) => {
  // get accessToken from request headers
  const authHeader = req.header('authorization');
  console.log('authHeader:', authHeader);

  const accessToken = authHeader && authHeader.split(' ')[1];

  // if there is no access token throw a 401 error with an appropriate message

  try {
    // verify the access token
    // const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;
    // console.log(decoded)
    //
    // if decoded.sub if falsy, throw a 403 error and indicate Invalid or expired token
    //
    // query the DB to find user by id that matches decoded.sub
    //
    // throw a 404 error if no user is found
    //
    // send generic success message and user info in response body
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
