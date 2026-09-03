import { useState } from "react";
import { Outlet } from "react-router-dom";
import { LogOut, Menu, Store, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.assign("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="min-h-screen w-full min-w-0 md:ml-72 md:w-[calc(100%-18rem)]">
        {/* MOBILE TOPBAR */}
        <div className="sticky top-0 z-40 border-b bg-white/95 shadow-sm backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b77a2e]">
                UrbanGent
              </p>
              <h1 className="text-lg font-semibold text-[#16283f]">Admin workspace</h1>
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              className="rounded-lg p-2 text-[#16283f] hover:bg-slate-100"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* MOBILE DROPDOWN MENU */}
          {sidebarOpen && (
            <div className="absolute right-4 top-full mt-2 overflow-hidden rounded-xl shadow-2xl">
              <AdminSidebar closeSidebar={() => setSidebarOpen(false)} mobile />
            </div>
          )}
        </div>

        <header className="hidden items-center justify-between border-b bg-white px-8 py-5 md:flex lg:px-10 xl:px-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b77a2e]">
              Control center
            </p>
            <p className="mt-1 text-sm text-slate-500">Manage your store in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-[#16283f] hover:text-[#16283f]"
            >
              <Store size={16} />
              View store
            </a>
            <button
              onClick={logoutHandler}
              className="flex items-center gap-2 rounded-lg bg-[#16283f] px-4 py-2 text-sm font-medium text-white hover:bg-[#243b55]"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </header>

        {/* PAGE CONTENT WRAPPER */}
        <div className="w-full max-w-[1600px] mx-auto">
          <div
            className="
              p-3
              sm:p-5
              md:p-8
              lg:p-10
              xl:px-14
              2xl:px-20
            "
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
