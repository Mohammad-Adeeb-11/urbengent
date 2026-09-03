import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { CheckCircle2, Clock3, Package, Truck } from "lucide-react";

const statusIcons = {
  Placed: Clock3,
  Processing: Package,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Cancelled: Clock3,
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/mine", {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  if (loading)
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Loading your orders...
      </div>
    );
  return (
    <div>
      <div className="border-b border-slate-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b77a2e]">
          Purchase history
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#16283f]">
          My orders
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Track every UrbanGent piece you have ordered.
        </p>
      </div>
      {orders.length ? (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const Icon = statusIcons[order.status] || Clock3;
            return (
              <article
                key={order._id}
                className="rounded-xl border border-slate-200 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      ORDER #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="flex items-center gap-2 rounded-full bg-[#eaf5f3] px-3 py-1.5 text-xs font-semibold text-[#3f7774]">
                    <Icon size={14} /> {order.status}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="text-slate-500">
                    {order.orderItems.length}{" "}
                    {order.orderItems.length === 1 ? "item" : "items"} · Cash on
                    Delivery
                  </span>
                  <span className="font-semibold text-[#16283f]">
                    ₹{order.totalPrice}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Package className="mx-auto text-slate-300" size={34} />
          <p className="mt-4 font-medium text-slate-600">No orders yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Your completed purchases will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
export default Orders;
