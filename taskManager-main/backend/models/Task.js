import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    deadline: { type: Date },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;
