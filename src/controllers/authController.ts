import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { PrismaClient } from '@prisma/client';
import { AuthError, AuthRequest } from '../types/auth.js';

const saltRounds = 10;
const prismaClient = new PrismaClient();

export async function signup(req: Request, res: Response): Promise<Response | void> {
  console.log('Signup request received:', req.body);
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const existing = await prismaClient.user.findUnique({ where: { email } });
  if (existing) {
    console.log('User already exists:', email);
    return res.status(400).json({ message: 'User already exists.' });
  }

  const hash = await bcrypt.hash(password, saltRounds);
  const user = await prismaClient.user.create({
    data: { 
      email, 
      password: hash,
      name 
    }
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });

  console.log('User created successfully:', { id: user.id, email: user.email });
  return res.json({ 
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    token 
  });
}

export async function login(req: Request, res: Response): Promise<Response | void> {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing credentials:', { email: !!email, password: !!password });
    return res.status(400).json({ message: 'Missing email or password.' });
  }

  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User not found:', email);
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Invalid password for user:', email);
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });

  console.log('Login successful for user:', { id: user.id, email: user.email });
  return res.json({ 
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    token 
  });
}

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // In a real application, you might want to invalidate the token
    // For now, we'll just return a success response
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret') as { userId: string };

    // Get the user
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new access token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
