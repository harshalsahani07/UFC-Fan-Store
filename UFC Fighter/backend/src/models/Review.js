import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    targetType: { type: String, enum: ["product", "fighter"], required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    fighter: { type: mongoose.Schema.Types.ObjectId, ref: "Fighter" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, fighter: 1 }, { unique: true, sparse: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
