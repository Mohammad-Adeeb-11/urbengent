import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const emptyAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState(emptyAddress);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const headers = { Authorization: `Bearer ${userInfo?.token}` };
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/cart", {
        headers,
      });
      setCart(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);
  const updateQuantity = async (productId, quantity) => {
    setUpdating(productId);
    try {
      await axios.put(
        "/api/cart/update",
        { productId, quantity },
        { headers },
      );
      await fetchCart();
    } finally {
      setUpdating("");
    }
  };
  const removeItem = async (productId) => {
    setUpdating(productId);
    try {
      await axios.delete("/api/cart/remove", {
        data: { productId },
        headers,
      });
      await fetchCart();
    } finally {
      setUpdating("");
    }
  };
  const items = cart.items.filter((item) => item.product);
  const totalPrice = items.reduce(
    (total, item) => total + (item.product.price || 0) * item.quantity,
    0,
  );
  const updateAddress = (event) =>
    setAddress((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const placeOrder = async (event) => {
    event.preventDefault();
    setPlacing(true);
    setError("");
    try {
      await axios.post(
        "/api/orders",
        { shippingAddress: address, paymentMethod: "COD" },
        { headers },
      );
      navigate("/account/orders", { state: { placed: true } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading)
    return (
      <div className="px-6 py-32 text-center text-sm text-slate-500">
        Loading your bag...
      </div>
    );
  if (!items.length)
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fbf3e5] text-[#b77a2e]">
          <ShoppingBag />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-[#16283f]">
          Your bag is waiting.
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Explore the collection and find something made for your everyday.
        </p>
        <Link
          to="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#16283f] px-5 py-3 text-sm font-semibold text-white"
        >
          Explore collection <ArrowRight size={17} />
        </Link>
      </main>
    );

  return (
    <main className="bg-[#f8fafb] px-4 py-10 sm:px-8 lg:px-16 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b77a2e]">
            Your selection
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-[#16283f]">
            Shopping bag
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {items.length} {items.length === 1 ? "piece" : "pieces"} selected
            for you.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-5 shadow-sm sm:px-7">
            {items.map((item) => (
              <div key={item.product._id} className="flex gap-4 py-5 sm:gap-6">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-28 w-24 rounded-lg object-cover sm:h-36 sm:w-28"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                        {item.product.category}
                      </p>
                      <h2 className="mt-1 truncate font-semibold text-[#16283f]">
                        {item.product.name}
                      </h2>
                    </div>
                    <p className="font-semibold text-[#16283f]">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    ₹{item.product.price} each
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button
                        disabled={updating === item.product._id}
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="p-2 text-slate-500 hover:text-[#b77a2e]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        disabled={updating === item.product._id}
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        className="p-2 text-slate-500 hover:text-[#b77a2e]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
          <aside className="h-fit rounded-xl bg-[#16283f] p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e9b872]">
              Order summary
            </p>
            <div className="mt-6 flex justify-between border-b border-white/10 pb-4 text-sm text-slate-300">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="mt-7 w-full rounded-lg bg-[#e9b872] px-4 py-3 text-sm font-semibold text-[#16283f] hover:bg-[#f3ca8d]"
            >
              Continue to checkout
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">
              Cash on Delivery available
            </p>
          </aside>
        </div>
      </div>
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16283f]/60 p-4">
          <form
            onSubmit={placeOrder}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b77a2e]">
                  Almost there
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#16283f]">
                  Delivery details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="text-sm text-slate-400 hover:text-[#16283f]"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["fullName", "Full name"],
                ["phone", "Phone number"],
                ["address", "Street address"],
                ["city", "City"],
                ["state", "State"],
                ["postalCode", "Postal code"],
              ].map(([name, label]) => (
                <label
                  key={name}
                  className={name === "address" ? "sm:col-span-2" : ""}
                >
                  <span className="mb-2 block text-sm font-semibold text-[#16283f]">
                    {label}
                  </span>
                  <input
                    required
                    name={name}
                    value={address[name]}
                    onChange={updateAddress}
                    className="input-style"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-lg bg-[#eaf5f3] p-3 text-sm text-[#3f7774]">
              <CheckCircle2 size={17} /> Cash on Delivery
            </div>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            <button
              disabled={placing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#16283f] py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {placing ? (
                <LoaderCircle className="animate-spin" size={17} />
              ) : (
                <ShoppingBag size={17} />
              )}{" "}
              {placing ? "Placing order..." : `Place order · ₹${totalPrice}`}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
export default Cart;
