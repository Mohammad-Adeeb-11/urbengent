import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, LoaderCircle, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
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
        setWishlist(data.products || []);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);
  const removeFromWishlist = async (id) => {
    setActionId(id);
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${id}`, {
        headers,
      });
      setWishlist((items) => items.filter((product) => product._id !== id));
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
      <div className="px-6 py-32 text-center text-sm text-slate-500">
        Loading your wishlist...
      </div>
    );
  return (
    <main className="bg-[#f8fafb] px-4 py-10 sm:px-8 lg:px-16 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b77a2e]">
            Saved for later
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-[#16283f]">
            Your wishlist
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {wishlist.length} saved {wishlist.length === 1 ? "piece" : "pieces"}
            .
          </p>
        </header>
        {wishlist.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </Link>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    {product.category}
                  </p>
                  <h2 className="mt-2 truncate text-sm font-semibold text-[#16283f]">
                    {product.name}
                  </h2>
                  <p className="mt-3 font-semibold text-[#16283f]">
                    ₹{product.price}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      disabled={actionId === product._id}
                      onClick={() => addToCart(product._id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#16283f] py-2.5 text-xs font-semibold text-white hover:bg-[#243b55]"
                    >
                      <ShoppingCart size={14} /> Add
                    </button>
                    <button
                      disabled={actionId === product._id}
                      onClick={() => removeFromWishlist(product._id)}
                      aria-label="Remove from wishlist"
                      className="rounded-lg border border-slate-200 px-3 text-slate-500 hover:border-red-200 hover:text-red-500"
                    >
                      {actionId === product._id ? (
                        <LoaderCircle size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-20 text-center">
            <Heart className="mx-auto text-[#b77a2e]" size={34} />
            <h2 className="mt-5 text-xl font-semibold text-[#16283f]">
              Nothing saved yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Tap the heart on a product to keep it close.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-lg bg-[#16283f] px-5 py-3 text-sm font-semibold text-white"
            >
              Explore collection
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
export default Wishlist;
