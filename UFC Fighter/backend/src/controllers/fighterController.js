import Fighter from "../models/Fighter.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

export const listFighters = async (req, res) => {
  const fighters = await Fighter.find().sort({ popularityScore: -1, createdAt: -1 });
  res.json(fighters);
};

export const getFighterDetails = async (req, res) => {
  const fighter = await Fighter.findById(req.params.id);
  if (!fighter) return res.status(404).json({ message: "Fighter not found" });

  const reviews = await Review.find({ targetType: "fighter", fighter: fighter._id }).populate("user", "name");
  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  res.json({ fighter, reviews, avgRating: Number(avgRating.toFixed(1)) });
};

export const addOrUpdateFighterRating = async (req, res) => {
  const { rating, comment } = req.body;
  const fighterId = req.params.id;
  const review = await Review.findOneAndUpdate(
    { targetType: "fighter", fighter: fighterId, user: req.user._id },
    { targetType: "fighter", fighter: fighterId, user: req.user._id, rating, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const fighterReviews = await Review.find({ targetType: "fighter", fighter: fighterId });
  const avg = fighterReviews.reduce((sum, r) => sum + r.rating, 0) / fighterReviews.length;
  await Fighter.findByIdAndUpdate(fighterId, { popularityScore: avg * fighterReviews.length });

  res.status(201).json(review);
};

export const getTrendingFighters = async (req, res) => {
  const top = await Fighter.find().sort({ popularityScore: -1 }).limit(5);
  res.json(top);
};

export const toggleWishlistFighter = async (req, res) => {
  const fighterId = req.params.id;
  const user = await User.findById(req.user._id);
  const exists = user.wishlistFighters.some((id) => id.toString() === fighterId);
  user.wishlistFighters = exists
    ? user.wishlistFighters.filter((id) => id.toString() !== fighterId)
    : [...user.wishlistFighters, fighterId];
  await user.save();
  res.json({ wishlistFighters: user.wishlistFighters });
};
