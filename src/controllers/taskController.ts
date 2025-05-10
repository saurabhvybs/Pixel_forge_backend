import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { PrismaClient } from '@prisma/client';

interface RequestWithUserId extends Request {
  userId?: string;
}

interface TaskData {
  title: string;
  description?: string | null;
  completed?: boolean ;
}

interface CreateTaskData {
  title: string;
  description?: string | null;
}

const prismaClient = new PrismaClient();

/**
 * Get all tasks for the authenticated user
 */
export async function getTasks(req: Request, res: Response) {
  const userReq = req as RequestWithUserId;
  
  try {
    const tasks = await prisma.task.findMany({ 
      where: { userId: userReq.userId! } 
    });
    return res.json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
}

/**
 * Create a new task for the authenticated user
 */
export async function createTask(req: Request, res: Response) {
  const userReq = req as RequestWithUserId;
  const { title, description }: CreateTaskData = req.body;
  
  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }
  
  try {
    const task = await prisma.task.create({ 
      data: { 
        title, 
        description, 
        userId: userReq.userId! 
      } 
    });
    return res.status(201).json(task);
  } catch (error) {
    console.error('Failed to create task:', error);
    return res.status(500).json({ message: 'Failed to create task' });
  }
}

/**
 * Update an existing task
 */
export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, completed }: TaskData = req.body;
  
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { 
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed })
      }
    });
    return res.json(task);
  } catch (error) {
    console.error(`Failed to update task with id ${id}:`, error);
    return res.status(500).json({ message: 'Failed to update task' });
  }
}

/**
 * Delete a task
 */
export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;
  
  try {
    await prisma.task.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    console.error(`Failed to delete task with id ${id}:`, error);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
}

export const getTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prismaClient.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};