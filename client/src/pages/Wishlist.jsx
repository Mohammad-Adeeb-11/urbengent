import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchWishlist = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/wishlist",
        config,
      );

      setWishlist(data.products);
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`http://localhost:5000/api/wishlist/${id}`, config);

    setWishlist(wishlist.filter((p) => p._id !== id));
  };

  const addToCart = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.post(
      "http://localhost:5000/api/cart",
      { productId: id, quantity: 1 },
      config,
    );

    alert("Added to cart 🛒");
  };

  return (
    <div className="px-6 md:px-20 py-16 bg-white min-h-screen">
      <h1 className="text-3xl font-semibold text-[#2E4A7D] mb-12">
        Your Wishlist ❤️
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-xl mb-4">Your wishlist is empty</p>
          <Link to="/" className="bg-[#2E4A7D] text-white px-6 py-3 rounded">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded-t-lg"
                />
              </Link>

              <div className="p-4">
                <h3 className="font-semibold text-[#2E4A7D] mb-2">
                  {product.name}
                </h3>

                <p className="text-lg font-bold mb-4">₹{product.price}</p>

                <div className="flex gap-3">
                  {/* Add to Cart */}
                  <button
                    onClick={() => addToCart(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#2E4A7D] text-white py-2 rounded hover:bg-[#243B55]"
                  >
                    <FiShoppingCart />
                    Add
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="flex items-center justify-center border px-3 rounded hover:bg-red-50"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
