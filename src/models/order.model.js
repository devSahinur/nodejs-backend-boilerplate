import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - items
 *         - totalAmount
 *       properties:
 *         orderNumber:
 *           type: string
 *           description: Unique order number
 *         user:
 *           type: string
 *           description: User ID who placed the order
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 */

const orderSchema = mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        image: {
          type: String,
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash', 'wallet'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentIntentId: {
      type: String,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    trackingNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
    cancelReason: {
      type: String,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

// Add plugins
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

// Static methods
orderSchema.statics.findByUser = async function (userId, options) {
  const filter = { user: userId };
  return this.paginate(filter, options);
};

orderSchema.statics.findByStatus = async function (status, options) {
  const filter = { status };
  return this.paginate(filter, options);
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
