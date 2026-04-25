import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const placeOrder = async (req, res) => {
  const { items, couponCode } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items are required" });
  }

  const hydratedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      return res.status(400).json({ message: "Invalid product in cart" });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }
    hydratedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });
    subtotal += product.price * item.quantity;
  }

  let discountAmount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    const validCoupon = coupon && coupon.expiresAt > new Date() && subtotal >= coupon.minOrderValue;
    if (validCoupon) {
      discountAmount = (subtotal * coupon.discountPercent) / 100;
    }
  }

  const totalAmount = Math.max(0, subtotal - discountAmount);

  for (const item of hydratedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, soldCount: item.quantity }
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: hydratedItems,
    subtotal,
    discountAmount,
    totalAmount,
    couponCode: couponCode || null
  });

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};
