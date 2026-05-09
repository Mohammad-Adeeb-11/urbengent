import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products",
  );

  if (!wishlist) {
    return res.json({ products: [] });
  }

  res.json(wishlist);
};

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({
      user: req.user._id,
      products: [productId],
    });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
  }

  await wishlist.save();

  res.json(wishlist);
};

export const removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.id,
    );

    await wishlist.save();
  }

  res.json(wishlist);
};
