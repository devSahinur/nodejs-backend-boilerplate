import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index.js';

const submitTaskSchema = mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tasks',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submission: {
      type: String,
      required: true,
    },
    files: [
      {
        url: String,
        path: String,
        filename: String,
      },
    ],
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected'],
      default: 'submitted',
    },
    feedback: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

submitTaskSchema.plugin(toJSON);
submitTaskSchema.plugin(paginate);

const SubmitTask = mongoose.model('SubmitTask', submitTaskSchema);

export default SubmitTask;
