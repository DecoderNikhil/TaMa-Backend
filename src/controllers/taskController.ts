import prisma from '../lib/prisma.js';
import { EnumTaskStatus } from '../generated/enums.js';
import e from 'express';

export const getTasks = async (req: any, res: any) => {
  try {
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const offset = (page - 1) * limit;

    const where: any = {};
    // Filtering
    const status = req.query.status?.toUpperCase();
    if (status && status in EnumTaskStatus) {
      where.status = status;
    }

    // Searching
    const title = req.query.title;
    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      take: limit,
      skip: offset,
    });

    res.status(200).json({
      status: 'success',
      messgae: 'Task fetched successfully',
      data: { tasksCount: tasks.length, tasks },
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const createTask = async (req: any, res: any) => {
  try {
    const { title, description } = req.body;
    let deadline = req.body.deadline;

    if (!title || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Title or description is missing',
      });
    }

    if (!deadline) {
      deadline = null;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        Deadline: deadline,
        status: 'PENDING',
        userId: req.user.id,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: task,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const getTask = async (req: any, res: any) => {
  try {
    const taskId = req.params.id;

    if (!taskId) {
      return res.status(400).json({
        status: 'error',
        message: 'Task id is missing',
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Task fetched successfully',
      data: task,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const updateTask = async (req: any, res: any) => {
  try {
    const taskId = req.params.id;
    const { title, description } = req.body;

    if (!taskId) {
      return res.status(400).json({
        status: 'error',
        message: 'Task id is missing',
      });
    }

    if (!title && !description) {
      res.status(400).json({
        status: 'error',
        message: 'Title or description is missing',
      });
    }

    const data: any = {};
    if (title) data.title = title;
    if (description) data.description = description;

    const task = await prisma.task.update({
      where: {
        id: taskId,
        userId: req.user.id,
      },
      data,
    });

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: task,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const deleteTask = async (req: any, res: any) => {
  try {
    const taskId = req.params.id;

    if (!taskId) {
      return res.status(400).json({
        status: 'error',
        message: 'Task id is missing',
      });
    }

    const task = await prisma.task.delete({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    res.status(204).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

export const toggleTaskStatus = async (req: any, res: any) => {
  try {
    const taskId = req.params.id;

    if (!taskId) {
      return res.status(400).json({
        status: 'error',
        message: 'Task id is missing',
      });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found',
      });
    }

    const newStatus =
      task.status === EnumTaskStatus.COMPLETED
        ? EnumTaskStatus.PENDING
        : EnumTaskStatus.COMPLETED;

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        userId: req.user.id,
      },
      data: {
        status: newStatus,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Task status updated successfully',
      data: updatedTask,
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
