import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    rating: Number,
    comment: String,
  },
  {
    timestamps: true,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    oldPrice: Number,
    image: String,
    category: {
      type: String,
      required: true,
    },
    description: String,
    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
