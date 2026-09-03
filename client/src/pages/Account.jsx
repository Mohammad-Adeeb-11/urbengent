import { createElement } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Heart, MapPin, Package, UserRound } from "lucide-react";

function Account() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const menu = [
    { name: "Overview", path: "/account", icon: UserRound, end: true },
    { name: "Profile", path: "/account/profile", icon: UserRound },
    { name: "Orders", path: "/account/orders", icon: Package },
    { name: "Wishlist", path: "/account/wishlist", icon: Heart },
    { name: "Addresses", path: "/account/addresses", icon: MapPin },
  ];
  return <main className="bg-[#f8fafb] px-4 py-10 sm:px-8 lg:px-16 lg:py-14"><div className="mx-auto max-w-6xl"><header className="relative overflow-hidden rounded-2xl bg-[#16283f] px-6 py-7 text-white shadow-lg sm:px-8"><div className="relative z-10"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e9b872]">Your account</p><div className="mt-4 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#e9b872] text-xl font-semibold text-[#16283f]">{userInfo?.avatar ? <img src={userInfo.avatar} alt="Profile" className="h-full w-full object-cover" /> : userInfo?.name?.charAt(0)?.toUpperCase()}</div><div><h1 className="text-2xl font-semibold">{userInfo?.name || "Welcome back"}</h1><p className="mt-1 text-sm text-slate-300">{userInfo?.email}</p></div></div></div><div className="absolute -right-12 -top-20 h-56 w-56 rounded-full border-[28px] border-[#b77a2e]/20" /></header><div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]"><nav className="h-fit rounded-xl border border-slate-200 bg-white p-3 shadow-sm">{menu.map(({ name, path, icon: Icon, end }) => <NavLink key={path} to={path} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${isActive ? "bg-[#16283f] text-white" : "text-slate-600 hover:bg-slate-50"}`}>{createElement(Icon, { size: 17 })}{name}</NavLink>)}</nav><section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"><Outlet /></section></div></div></main>;
}
export default Account;
