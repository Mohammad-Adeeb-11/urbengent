import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FiHeart } from "react-icons/fi";

function ProductCard({ product }) {
  const [wishLoading, setWishLoading] = useState(false);

  const addToWishlist = async (productId) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo?.token) {
      localStorage.removeItem("userInfo");
      alert("Please login first");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      setWishLoading(true);

      await axios.post(
        "http://localhost:5000/api/wishlist",
        { productId },
        config,
      );

      alert("Added to wishlist ❤️");
    } catch (error) {
      console.log(error);
    } finally {
      setWishLoading(false);
    }
  };

  const discount =
    product.oldPrice &&
    Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition duration-300 flex flex-col">
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px] object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* WISHLIST */}
        <button
          onClick={() => addToWishlist(product._id)}
          className="absolute top-3 right-3 bg-white w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition"
        >
          <FiHeart size={18} />
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        {/* NAME */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm md:text-base font-semibold text-[#2E4A7D] line-clamp-2 hover:underline">
            {product.name}
          </h3>
        </Link>

        {/* RATING */}
        <div className="flex items-center text-yellow-500 text-xs md:text-sm mt-1">
          {"★".repeat(Math.round(product.rating || 0))}
          {"☆".repeat(5 - Math.round(product.rating || 0))}

          <span className="ml-2 text-gray-500">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* SIZES */}
        <div className="hidden md:block h-6 mt-2">
          <p className="text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition">
            Sizes: S | M | L | XL
          </p>
        </div>

        {/* PRICE */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-base md:text-lg font-bold text-[#2E4A7D]">
            ₹{product.price}
          </span>

          {product.oldPrice && (
            <>
              <span className="text-gray-400 line-through text-sm">
                ₹{product.oldPrice}
              </span>

              <span className="text-green-600 text-xs md:text-sm font-medium">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
