import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";

import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id", protect, async (req, res) => {
  if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You can only update your own profile" });
  }

  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});
router.get("/addresses", protect, (req, res) => res.json(req.user.addresses));
router.post("/addresses", protect, async (req, res) => {
  const { label, fullName, phone, address, city, state, postalCode } = req.body;
  if (
    ![fullName, phone, address, city, state, postalCode].every((value) =>
      String(value || "").trim(),
    )
  ) {
    return res
      .status(400)
      .json({ message: "Please complete all address fields" });
  }
  req.user.addresses.push({
    label,
    fullName,
    phone,
    address,
    city,
    state,
    postalCode,
  });
  await req.user.save();
  res.status(201).json(req.user.addresses.at(-1));
});
router.put("/addresses/:addressId", protect, async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);
  if (!address) return res.status(404).json({ message: "Address not found" });
  Object.assign(address, req.body);
  await req.user.save();
  res.json(address);
});
router.delete("/addresses/:addressId", protect, async (req, res) => {
  const address = req.user.addresses.id(req.params.addressId);
  if (!address) return res.status(404).json({ message: "Address not found" });
  address.deleteOne();
  await req.user.save();
  res.json({ message: "Address removed" });
});
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;
