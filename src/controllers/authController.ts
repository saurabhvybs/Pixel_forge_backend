import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const saltRounds = 10;

export async function signup(req: Request, res: Response): Promise<Response | void> {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Missing email or password.' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return res.status(400).json({ message: 'User already exists.' });

  const hash = await bcrypt.hash(password, saltRounds);
  const user = await prisma.user.create({
    data: { email: email, password: hash }
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });

  return res.json({ token });
}

export async function login(req: Request, res: Response): Promise<Response | void> {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Missing email or password.' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(400).json({ message: 'Invalid credentials.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: 'Invalid credentials.' });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });

  return res.json({ token });
}
