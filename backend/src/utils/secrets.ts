import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const ENVIRONMENT = process.env.NODE_ENV;
export const PORT = (process.env.PORT || 3000) as number;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const COOKIE_KEY = process.env.COOKIE_KEY || '';

export const generateAccessToken = (user: any) =>
  jwt.sign(user, 'my-secret-key', { expiresIn: '1h' });

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const barrierToken = req.headers.authorization;

  if (!barrierToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(barrierToken.split(' ')[1], 'my-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = decoded; // Attach the user to the request object
    next();
  });
};
