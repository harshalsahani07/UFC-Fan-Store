import { Router } from "express";
import {
  addOrUpdateProductReview,
  getProductDetails,
  getTrendingProducts,
  listProducts,
  toggleWishlistProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", listProducts);
router.get("/trending/top-selling", getTrendingProducts);
router.get("/:id", getProductDetails);
router.post("/:id/reviews", protect, addOrUpdateProductReview);
router.post("/:id/wishlist", protect, toggleWishlistProduct);

export default router;
