import { Link, Outlet, useLocation } from "react-router-dom";

function Account() {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const menu = [
    { name: "Profile", path: "/account/profile" },
    { name: "Orders", path: "/account/orders" },
    { name: "Wishlist", path: "/account/wishlist" },
    { name: "Addresses", path: "/account/addresses" },
  ];

  return (
    <div className="px-4 md:px-20 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* PROFILE HEADER */}
        <div className="bg-white shadow rounded-lg p-6 mb-8 flex items-center gap-4">
          <div className="w-14 h-14 bg-[#2E4A7D] text-white flex items-center justify-center rounded-full text-xl font-semibold">
            {userInfo?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-[#2E4A7D]">
              {userInfo?.name}
            </h2>

            <p className="text-gray-600 text-sm">{userInfo?.email}</p>

            <p className="text-gray-400 text-xs">
              Member since {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* MOBILE MENU (Tabs) */}
        <div className="md:hidden mb-6 overflow-x-auto">
          <div className="flex gap-3">
            {menu.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-md whitespace-nowrap text-sm ${
                  location.pathname === item.path
                    ? "bg-[#2E4A7D] text-white"
                    : "bg-white border"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="grid md:grid-cols-[250px_1fr] gap-8">
          {/* SIDEBAR */}
          <div className="hidden md:block bg-white rounded-lg shadow p-6 h-fit">
            <h3 className="text-lg font-semibold text-[#2E4A7D] mb-6">
              My Account
            </h3>

            <ul className="space-y-3">
              {menu.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3 rounded-md transition ${
                    location.pathname === item.path
                      ? "bg-[#2E4A7D] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </ul>
          </div>

          {/* CONTENT AREA */}
          <div className="bg-white rounded-lg shadow p-5 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
