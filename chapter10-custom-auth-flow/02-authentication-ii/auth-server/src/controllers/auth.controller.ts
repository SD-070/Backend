import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_JWT_SECRET, REFRESH_TOKEN_TTL, SALT_ROUNDS, ACCESS_TOKEN_TTL } from '#config';
import { User, RefreshToken } from '#models';
import { createTokens } from '#utils';

export const register: RequestHandler = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const userExists = await User.exists({ email });
  if (userExists) throw new Error('Email already registered', { cause: { status: 409 } });

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPW = await bcrypt.hash(password, salt);

  const user = await User.create({ email, password: hashedPW, firstName, lastName });
  const [refreshToken, accessToken] = await createTokens(user);

  res.status(201).json({ message: 'Registered', refreshToken, accessToken });
};

export const login: RequestHandler = async (req, res) => {
  // get email and password from request body
  const { email, password } = req.body;
  // query the DB to find user with that email
  const user = await User.findOne({ email }).lean();

  // if not user is found, throw a 401 error and indicate invalid credentials
  if (!user) throw new Error('Incorrect credentials', { cause: { status: 401 } });

  // compare the password to the hashed password in the DB with bcrypt
  const match = await bcrypt.compare(password, user.password);

  // if match is false, throw a 401 error and indicate invalid credentials
  if (!match) throw new Error('Incorrect credentials', { cause: { status: 401 } });

  // delete all Refresh Tokens in DB where userId is equal to _id of user
  await RefreshToken.deleteMany({ userId: user._id });

  // generate refresh and access tokens
  const [refreshToken, accessToken] = await createTokens(user);
  // send generic success message, refreshToken, and accessToken in body of response
  res.json({ message: 'Welcome back', refreshToken, accessToken });
};

export const refresh: RequestHandler = async (req, res) => {
  // destructure refreshToken from body of request
  //
  // if no refresh token, throw a 401 (or validate with Zod)
  //
  // query the DB for the refresh that has a token property that matches the refreshToken
  //
  // if not stored token is found, throw a 403
  //
  // delete the stored from the DB
  //
  // query the DB for a user that matches the userId of the stored token
  //
  // throw a 403 if no user is found
  //
  // create new tokens with out util function
  //
  // rend success message and new tokens in the body of the response
};

export const logout: RequestHandler = async (req, res) => {
  // clearing tokens from local storage on the client
  // destructure refreshToken from body of request
  //
  // delete RefreshToken from db that matches that token
  //
  // send generic success message in response body
};

export const me: RequestHandler = async (req, res, next) => {
  // get accessToken from request headers
  const authHeader = req.header('authorization');
  // console.log('authHeader:', authHeader);

  const accessToken = authHeader && authHeader.split(' ')[1];

  // console.log('accessToken', accessToken);

  // if there is no access token throw a 401 error with an appropriate message
  if (!accessToken) throw Error('Please sign in', { cause: { status: 401 } });

  try {
    // verify the access token
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;
    console.log(decoded);

    // if decoded.sub if falsy, throw a 401 error and indicate Invalid or expired token
    if (!decoded.sub)
      throw new Error('Invalid or expired access token', { cause: { status: 401 } });

    // query the DB to find user by id that matches decoded.sub
    const user = await User.findById(decoded.sub).select('-password').lean();

    // throw a 404 error if no user is found
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    // send generic success message and user info in response body
    res.json({ message: 'Valid token', user });
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
