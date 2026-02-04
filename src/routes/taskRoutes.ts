import express from 'express';
import { authenticateUser } from '../controllers/authController.js';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', authenticateUser, getTasks);
router.post('/', authenticateUser, createTask);

router.get('/:id', authenticateUser, getTask);
router.patch('/:id', authenticateUser, updateTask);
router.delete('/:id', authenticateUser, deleteTask);

router.patch('/:id/toggle', authenticateUser, toggleTaskStatus);

export default router;
