import { NavLink } from "react-router-dom";
import { createElement } from "react";
import { BarChart3, Box, ClipboardList, Plus, Users } from "lucide-react";

function AdminSidebar({ closeSidebar, mobile = false }) {
  const links = [
    { to: "/admin", label: "Overview", icon: BarChart3, end: true },
    { to: "/admin/products", label: "Products", icon: Box },
    { to: "/admin/orders", label: "Orders", icon: ClipboardList },
    { to: "/admin/create-product", label: "Add product", icon: Plus },
    { to: "/admin/users", label: "Users", icon: Users },
  ];

  return (
    <aside
      className={`${
        mobile
          ? "flex max-h-[calc(100vh-5rem)] w-72 flex-col overflow-y-auto"
          : "fixed inset-y-0 left-0 flex w-72 flex-col"
      } bg-[#16283f] px-5 py-7 text-white`}
    >
      <div className="border-b border-white/10 px-3 pb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e9b872]">
          UrbanGent
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Admin workspace</h2>
      </div>

      <nav className="mt-8 space-y-2">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Manage
        </p>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#e9b872] text-[#16283f] shadow-lg shadow-black/10"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {createElement(Icon, { size: 18, strokeWidth: 1.8 })}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 px-3 pt-6 text-xs leading-5 text-slate-400">
        Keep your catalog sharp and your customers close.
      </div>
    </aside>
  );
}

export default AdminSidebar;
