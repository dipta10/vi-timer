import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const ENVIRONMENT = process.env.NODE_ENV;
export const PRODUCTION = ENVIRONMENT === 'production';
export const PORT = (process.env.PORT || 3000) as number;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const COOKIE_KEY = process.env.COOKIE_KEY || '';
export const UI_URL = process.env.UI_URL as string;
export const BACKEND_URL = process.env.BACKEND_URL as string;

export const generateAccessToken = (user: Request['user']) => {
  if (!user) return '';
  return jwt.sign(user, 'my-secret-key', { expiresIn: '1h' });
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!PRODUCTION) {
    req.user = {
      id: 'test-id',
      name: 'Dev User',
      googleId: 'test-google-id',
    };
    next();
    return;
  }
  const barrierToken = req.headers.authorization;

  if (!barrierToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(barrierToken.split(' ')[1], 'my-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = decoded as any; // Attach the user to the request object
    next();
  });
};
