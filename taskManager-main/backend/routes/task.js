import express from 'express';
import { VerifyUser } from '../middleware/verify.js';
import {
  addTask,
  getAllTasks,
  removeTask,
  updateTask,
} from '../controllers/taskController.js';

const router = express.Router();

// Create a task
router.post('/create', VerifyUser, addTask);

// Get all tasks for a user
router.get('/get-tasks', VerifyUser, getAllTasks);

// Update a task
router.put('/update/:id', VerifyUser, updateTask);

// Delete a task
router.delete('/delete/:id', VerifyUser, removeTask);

export default router;
