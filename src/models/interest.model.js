import mongoose from 'mongoose';
import { toJSON } from './plugins/index.js';

const interestSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
interestSchema.plugin(toJSON);

const Interest = mongoose.model('Interest', interestSchema);

export default Interest;
