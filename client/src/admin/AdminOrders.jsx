import { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardList, LoaderCircle } from "lucide-react";

const statuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/orders", {
          headers,
        });
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  const updateStatus = async (id, status) => {
    setSavingId(id);
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/orders/${id}/status`,
        { status },
        { headers },
      );
      setOrders((current) =>
        current.map((order) =>
          order._id === id ? { ...order, status: data.status } : order,
        ),
      );
    } finally {
      setSavingId("");
    }
  };
  return (
    <main className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b77a2e]">
          Operations
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#16283f]">Orders</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review purchases and keep deliveries moving.
        </p>
      </header>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-7 py-16 text-center text-sm text-slate-400">
            Loading orders...
          </p>
        ) : orders.length ? (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div
                key={order._id}
                className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_180px_180px] md:items-center md:px-7"
              >
                <div>
                  <p className="text-xs font-semibold text-[#16283f]">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {order.user?.name || "Customer"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {order.user?.email} · {order.orderItems.length} items
                  </p>
                </div>
                <p className="font-semibold text-[#16283f]">
                  ₹{order.totalPrice}
                </p>
                <div className="flex items-center gap-2">
                  <select
                    disabled={savingId === order._id}
                    value={order.status}
                    onChange={(event) =>
                      updateStatus(order._id, event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-[#b77a2e]"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  {savingId === order._id && (
                    <LoaderCircle
                      size={16}
                      className="animate-spin text-[#b77a2e]"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-7 py-16 text-center">
            <ClipboardList className="mx-auto text-slate-300" size={34} />
            <p className="mt-3 text-sm text-slate-500">
              No orders have been placed yet.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
export default AdminOrders;
