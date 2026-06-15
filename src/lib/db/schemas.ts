import mongoose, { Schema } from 'mongoose';

// User Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Product Schema
const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '/images/placeholder.jpg' },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Order Schema
const OrderSchema = new Schema({
  userId: { type: String, required: true, index: true },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    quantity: { type: Number, required: true }
  }],
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentInfo: {
    cardNumber: { type: String, default: '' },
    cardHolder: { type: String, default: '' }
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Avoid re-defining models on Next.js dev reloads
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
