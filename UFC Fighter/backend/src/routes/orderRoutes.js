import { Router } from "express";
import { getMyOrders, placeOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, placeOrder);
router.get("/mine", protect, getMyOrders);

export default router;
