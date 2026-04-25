import { Router } from "express";
import {
  addOrUpdateFighterRating,
  getFighterDetails,
  getTrendingFighters,
  listFighters,
  toggleWishlistFighter
} from "../controllers/fighterController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", listFighters);
router.get("/trending/popular", getTrendingFighters);
router.get("/:id", getFighterDetails);
router.post("/:id/ratings", protect, addOrUpdateFighterRating);
router.post("/:id/wishlist", protect, toggleWishlistFighter);

export default router;
