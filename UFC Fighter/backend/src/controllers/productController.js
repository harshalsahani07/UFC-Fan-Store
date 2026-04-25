import Product from "../models/Product.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

export const listProducts = async (req, res) => {
  const q = req.query.q?.trim();
  const query = { isActive: true };
  if (q) query.name = { $regex: q, $options: "i" };
  const products = await Product.find(query).sort({ createdAt: -1 });
  res.json(products);
};

export const getProductDetails = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const reviews = await Review.find({ targetType: "product", product: product._id }).populate("user", "name");
  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  res.json({ product, reviews, avgRating: Number(avgRating.toFixed(1)) });
};

export const addOrUpdateProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const review = await Review.findOneAndUpdate(
    { targetType: "product", product: productId, user: req.user._id },
    { targetType: "product", product: productId, user: req.user._id, rating, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json(review);
};

export const getTrendingProducts = async (req, res) => {
  const top = await Product.find({ isActive: true }).sort({ soldCount: -1 }).limit(5);
  res.json(top);
};

export const toggleWishlistProduct = async (req, res) => {
  const productId = req.params.id;
  const user = await User.findById(req.user._id);
  const exists = user.wishlistProducts.some((id) => id.toString() === productId);
  user.wishlistProducts = exists
    ? user.wishlistProducts.filter((id) => id.toString() !== productId)
    : [...user.wishlistProducts, productId];
  await user.save();
  res.json({ wishlistProducts: user.wishlistProducts });
};
