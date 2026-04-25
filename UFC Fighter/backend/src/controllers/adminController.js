import Coupon from "../models/Coupon.js";
import Fighter from "../models/Fighter.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product archived" });
};

export const createFighter = async (req, res) => {
  const fighter = await Fighter.create(req.body);
  res.status(201).json(fighter);
};

export const updateFighter = async (req, res) => {
  const fighter = await Fighter.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!fighter) return res.status(404).json({ message: "Fighter not found" });
  res.json(fighter);
};

export const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
};

export const getAnalytics = async (req, res) => {
  const [totalUsers, totalOrders, totalRevenue, totalProducts, totalFighters] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, sum: { $sum: "$totalAmount" } } }]),
    Product.countDocuments({ isActive: true }),
    Fighter.countDocuments()
  ]);

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email");
  const topRatedFighters = await Review.aggregate([
    { $match: { targetType: "fighter" } },
    { $group: { _id: "$fighter", avgRating: { $avg: "$rating" }, totalRatings: { $sum: 1 } } },
    { $sort: { avgRating: -1, totalRatings: -1 } },
    { $limit: 5 }
  ]);

  res.json({
    kpis: {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.sum || 0,
      totalProducts,
      totalFighters
    },
    recentOrders,
    topRatedFighters
  });
};
