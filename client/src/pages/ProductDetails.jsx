import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { FiShoppingBag, FiHeart } from "react-icons/fi";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [loadingCart, setLoadingCart] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const addToCartHandler = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo?.token) {
      localStorage.removeItem("userInfo");
      navigate("/login");
      return;
    }

    try {
      setLoadingCart(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        "/api/cart",
        {
          productId: id,
          quantity,
        },
        config,
      );

      alert("Added to cart successfully 😎");
      navigate("/cart");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoadingCart(false);
    }
  };

  const submitReview = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo?.token) {
      localStorage.removeItem("userInfo");
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        config,
      );

      alert("Review submitted ⭐");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting review");
    }
  };

  if (!product) {
    return (
      <div className="py-32 text-center text-lg text-[#2E4A7D]">
        Loading product...
      </div>
    );
  }

  const discount =
    product.oldPrice &&
    Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div className="bg-white">
      {/* PRODUCT SECTION */}
      <div className="px-6 md:px-20 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
          {/* IMAGE */}
          <div className="overflow-hidden rounded-lg group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[350px] md:h-[600px] object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-[#2E4A7D]">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="flex items-center mb-4 text-yellow-500 text-sm">
              {"★".repeat(Math.round(product.rating))}
              {"☆".repeat(5 - Math.round(product.rating))}
              <span className="ml-2 text-gray-500">
                ({product.numReviews} reviews)
              </span>
            </div>

            {/* PRICE */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl md:text-3xl font-bold text-[#2E4A7D]">
                ₹{product.price}
              </span>

              {product.oldPrice && (
                <>
                  <span className="text-gray-400 line-through text-lg">
                    ₹{product.oldPrice}
                  </span>

                  <span className="text-green-600 font-medium">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-600 leading-7 mb-8">
              {product.description}
            </p>

            {/* SIZE */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-3">Select Size</h3>

              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 border rounded-md ${
                      selectedSize === size
                        ? "bg-[#2E4A7D] text-white"
                        : "hover:border-[#2E4A7D]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-3">Quantity</h3>

              <div className="flex items-center border w-fit rounded-md">
                <button
                  onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  className="px-4 py-2"
                >
                  -
                </button>

                <span className="px-6">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={addToCartHandler}
                disabled={loadingCart}
                className="flex-1 flex items-center justify-center gap-3 bg-[#2E4A7D] text-white py-4 rounded-md font-semibold hover:bg-[#243B55]"
              >
                <FiShoppingBag />
                {loadingCart ? "ADDING..." : "ADD TO BAG"}
              </button>

              <button className="flex-1 flex items-center justify-center gap-3 border border-gray-300 text-[#2E4A7D] py-4 rounded-md hover:border-[#2E4A7D]">
                <FiHeart />
                WISHLIST
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="px-6 md:px-20 pb-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-[#2E4A7D]">
          Customer Reviews
        </h2>

        {/* REVIEW FORM */}
        <div className="bg-gray-50 p-6 md:p-8 rounded-xl shadow-sm mb-12">
          <h3 className="text-xl font-semibold mb-6 text-[#2E4A7D]">
            Write a Review
          </h3>

          {/* Rating */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">Rating</label>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#2E4A7D]"
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Good</option>
              <option value="3">⭐⭐⭐ Average</option>
              <option value="2">⭐⭐ Poor</option>
              <option value="1">⭐ Bad</option>
            </select>
          </div>

          {/* Comment */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Your Review
            </label>

            <textarea
              placeholder="Share your experience with this product..."
              className="w-full border rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#2E4A7D]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            onClick={submitReview}
            className="bg-[#2E4A7D] text-white px-8 py-3 rounded-lg hover:bg-[#243B55] transition"
          >
            Submit Review
          </button>
        </div>

        {/* REVIEW LIST */}
        <div className="space-y-6">
          {product.reviews?.length === 0 && (
            <p className="text-gray-500">No reviews yet</p>
          )}

          {product.reviews?.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
            >
              {/* Rating + Date */}
              <div className="flex justify-between items-center mb-3">
                <div className="text-yellow-500 text-lg">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                <span className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Comment */}
              <p className="text-gray-600 leading-7 mb-5">{review.comment}</p>

              {/* User */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold">
                  {review.name.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold text-gray-800">{review.name}</p>
                  <p className="text-sm text-gray-400">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
