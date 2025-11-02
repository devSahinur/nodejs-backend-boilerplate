import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index.js';

const withdrawalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ['bank_transfer', 'paypal', 'stripe', 'mobile_money'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'rejected'],
      default: 'pending',
    },
    accountDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    transactionId: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

withdrawalSchema.plugin(toJSON);
withdrawalSchema.plugin(paginate);

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

export default Withdrawal;
