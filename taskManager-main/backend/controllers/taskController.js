import { errorHandler } from '../middleware/errorHandler.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

// Function to create a new task and associate it with a user
export const addTask = async (req, res) => {
  try {
    const user = req.user.id;
    const { title, description, priority, deadline } = req.body;

    // Create a new task
    const newTask = new Task({
      user: user,
      title,
      description,
      priority,
      deadline,
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Find the user and update their tasks array
    await User.findByIdAndUpdate(
      user,
      { $push: { tasks: savedTask._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ message: 'Task created successfully', task: savedTask });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

export const updateTask = async (req, res) => {
  const { title, description, priority, deadline } = req.body;

  const taskFields = {};
  if (title) taskFields.title = title;
  if (description) taskFields.description = description;
  if (priority) taskFields.priority = priority;
  if (deadline) taskFields.deadline = deadline;

  try {
    // Find task by ID and ensure the user owns it
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Check user ownership
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const userRef = req.user.id;
    const searchTerm = req.query.searchTerm || '';
    const user = await User.findById(userRef).populate('tasks');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    let allTasks = user.tasks;

    if (searchTerm) {
      allTasks = allTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    res.json(allTasks);
  } catch (error) {
    console.log(error);
  }
};

export const removeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return errorHandler(
        404,
        'You must be logged in to remove a product from cart'
      );
    }

    user.tasks = user.tasks.filter((task) => task.toString() !== taskId);
    await user.save();

    res.json({ message: 'Task removed successfully', tasks: user.tasks });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
