import { Router } from "express";
import {
  createCoupon,
  createFighter,
  createProduct,
  deleteProduct,
  getAnalytics,
  updateFighter,
  updateProduct
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/analytics", getAnalytics);

router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.post("/fighters", createFighter);
router.put("/fighters/:id", updateFighter);

router.post("/coupons", createCoupon);

export default router;
