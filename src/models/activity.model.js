import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index.js';

const activitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['login', 'logout', 'register', 'update_profile', 'password_change', 'order_placed', 'payment', 'other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.plugin(toJSON);
activitySchema.plugin(paginate);

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
