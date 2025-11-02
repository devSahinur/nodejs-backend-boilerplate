import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index.js';

const referralSchema = mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referred: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed'],
      default: 'pending',
    },
    reward: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

referralSchema.plugin(toJSON);
referralSchema.plugin(paginate);

const Referral = mongoose.model('Referral', referralSchema);

export default Referral;
