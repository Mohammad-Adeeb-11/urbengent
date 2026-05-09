import { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchCart = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/cart",
        config,
      );

      setCart(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchCart();
    }
  }, []);

  const updateQuantity = async (productId, quantity) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(
      "http://localhost:5000/api/cart/update",
      { productId, quantity },
      config,
    );

    fetchCart();
  };

  const removeItem = async (productId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete("http://localhost:5000/api/cart/remove", {
      data: { productId },
      headers: config.headers,
    });

    fetchCart();
  };

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0,
  );

  if (loading) {
    return <div className="py-32 text-center">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="py-32 text-center text-lg text-[#2E4A7D]">
        Your cart is empty 🛒
      </div>
    );
  }

  return (
    <div className="px-6 md:px-20 py-16">
      <h1 className="text-3xl font-semibold mb-10 text-[#2E4A7D]">Your Cart</h1>

      <div className="space-y-8">
        {cart.items
          .filter((item) => item.product)
          .map((item) => (
            <div key={item.product._id} className="flex gap-6 border-b pb-6">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-32 h-32 object-cover rounded-md"
              />

              <div className="flex-1">
                <h3 className="text-xl font-medium text-[#2E4A7D]">
                  {item.product.name}
                </h3>

                <p className="text-gray-600 mb-4">₹{item.product.price}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product._id,
                        item.quantity > 1 ? item.quantity - 1 : 1,
                      )
                    }
                    className="px-3 py-1 border"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="px-3 py-1 border"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-500 ml-6"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="mt-12 text-right">
        <h2 className="text-2xl font-semibold text-[#2E4A7D]">
          Total: ₹{totalPrice}
        </h2>
      </div>
    </div>
  );
}

export default Cart;
