import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload: object): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as unknown as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function signRefreshToken(payload: object): string {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as unknown as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken<T = object>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET) as T;
}

export function verifyRefreshToken<T = object>(token: string): T {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as T;
}
