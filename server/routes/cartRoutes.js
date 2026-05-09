import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getCart).post(protect, addToCart);

router.put("/update", protect, updateCartItem);
router.delete("/remove", protect, removeCartItem);

export default router;
