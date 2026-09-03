import { createElement, useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Heart, MapPin, Package, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

function Overview() {
  const [summary, setSummary] = useState({ orders: 0, wishlist: 0, addresses: 0 });
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [orders, wishlist, addresses] = await Promise.all([
          axios.get("http://localhost:5000/api/orders/mine", config),
          axios.get("http://localhost:5000/api/wishlist", config),
          axios.get("http://localhost:5000/api/users/addresses", config),
        ]);
        setSummary({ orders: orders.data.length, wishlist: (wishlist.data.products || []).length, addresses: addresses.data.length });
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, [token]);

  const cards = [
    { label: "Orders", value: summary.orders, detail: "Track your purchases", path: "/account/orders", icon: Package, color: "bg-[#eef3fb] text-[#315687]" },
    { label: "Wishlist", value: summary.wishlist, detail: "Pieces saved for later", path: "/account/wishlist", icon: Heart, color: "bg-[#fff2ef] text-[#b45d42]" },
    { label: "Addresses", value: summary.addresses, detail: "Saved delivery details", path: "/account/addresses", icon: MapPin, color: "bg-[#eaf5f3] text-[#3f7774]" },
  ];

  return <div><div className="border-b border-slate-100 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b77a2e]">Account overview</p><h2 className="mt-2 text-2xl font-semibold text-[#16283f]">Welcome back, {userInfo?.name || "there"}.</h2><p className="mt-1 text-sm text-slate-500">Everything important about your UrbanGent account, in one place.</p></div><div className="mt-7 grid gap-4 sm:grid-cols-3">{cards.map(({ label, value, detail, path, icon: Icon, color }) => <Link key={path} to={path} className="rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"><span className={`inline-flex rounded-lg p-2 ${color}`}>{createElement(Icon, { size: 18 })}</span><p className="mt-5 text-2xl font-semibold text-[#16283f]">{loading ? "--" : value}</p><p className="mt-1 text-sm font-semibold text-slate-600">{label}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></Link>)}</div><div className="mt-7 rounded-xl bg-[#f8fafb] p-5 sm:p-6"><div className="flex items-center gap-3"><span className="rounded-lg bg-[#e9b872] p-2 text-[#16283f]"><UserRound size={18} /></span><div><h3 className="font-semibold text-[#16283f]">Keep your details current</h3><p className="mt-1 text-sm text-slate-500">A current profile helps us make every order smoother.</p></div></div><Link to="/account/profile" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#b77a2e] hover:text-[#16283f]">Update profile <ArrowRight size={16} /></Link></div></div>;
}
export default Overview;
