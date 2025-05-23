import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Create an interface extending the Request
interface RequestWithUserId extends Request {
  userId?: string;
}

declare const process: {
  env: {
    JWT_SECRET: string;
  };
};

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Type assert req to our extended interface
    (req as RequestWithUserId).userId = (decoded as any).userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
}