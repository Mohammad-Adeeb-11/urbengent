import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const requiredAddressFields = ["fullName", "phone", "address", "city", "state", "postalCode"];

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "COD" } = req.body;

    if (paymentMethod !== "COD") {
      return res.status(400).json({ message: "Only Cash on Delivery is currently available" });
    }
    if (!shippingAddress || requiredAddressFields.some((field) => !String(shippingAddress[field] || "").trim())) {
      return res.status(400).json({ message: "Please provide all shipping address details" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    const items = (cart?.items || []).filter((item) => item.product);
    if (!items.length) return res.status(400).json({ message: "Your cart is empty" });

    const orderItems = items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));
    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const order = await Order.create({ user: req.user._id, orderItems, shippingAddress, paymentMethod, totalPrice });

    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const allowedStatuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status" });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};
