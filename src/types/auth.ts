import { Request } from 'express';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export interface AuthRequest extends Request {
  userId?: string;
}

export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
} 