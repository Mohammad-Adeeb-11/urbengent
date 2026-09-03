import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, LoaderCircle, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/wishlist", {
          headers,
        });
        setProducts(data.products || []);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeProduct = async (id) => {
    setActionId(id);
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${id}`, {
        headers,
      });
      setProducts((current) => current.filter((product) => product._id !== id));
    } finally {
      setActionId("");
    }
  };

  const addToCart = async (id) => {
    setActionId(id);
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: id, quantity: 1 },
        { headers },
      );
      alert("Added to cart");
    } finally {
      setActionId("");
    }
  };

  if (loading)
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Loading wishlist...
      </div>
    );
  return (
    <div>
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b77a2e]">
            Saved pieces
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#16283f]">
            Wishlist
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep the pieces you love close.
          </p>
        </div>
        <Heart size={21} className="text-[#b77a2e]" />
      </div>
      {products.length ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {products.map((product) => (
            <article
              key={product._id}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              </Link>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-[#16283f]">
                  {product.name}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#16283f]">
                  ₹{product.price}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    disabled={actionId === product._id}
                    onClick={() => addToCart(product._id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#16283f] py-2 text-xs font-semibold text-white"
                  >
                    <ShoppingCart size={13} /> Add
                  </button>
                  <button
                    disabled={actionId === product._id}
                    onClick={() => removeProduct(product._id)}
                    aria-label="Remove from wishlist"
                    className="rounded-lg border border-slate-200 px-2.5 text-red-500"
                  >
                    {actionId === product._id ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Heart size={32} className="mx-auto text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Your wishlist is empty
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-flex rounded-lg bg-[#16283f] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Explore products
          </Link>
        </div>
      )}
    </div>
  );
}
export default Wishlist;
