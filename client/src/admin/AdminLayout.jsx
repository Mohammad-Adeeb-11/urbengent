import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 w-full min-w-0">
        {/* MOBILE TOPBAR */}
        <div className="md:hidden bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className="text-xl font-bold text-[#2E4A7D]">
              UrbanGent Admin
            </h1>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#2E4A7D]"
            >
              {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* MOBILE DROPDOWN MENU */}
          {sidebarOpen && (
            <div className="absolute top-full right-4 mt-2 w-64 bg-[#2E4A7D] rounded-2xl shadow-2xl overflow-hidden">
              <AdminSidebar closeSidebar={() => setSidebarOpen(false)} />
            </div>
          )}
        </div>

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
