import { Link } from "react-router-dom";
import { FiBox, FiUsers, FiBarChart2, FiPlus } from "react-icons/fi";

function AdminSidebar() {
  return (
    <div className="w-64 bg-[#2E4A7D] text-white p-6">
      <h2 className="text-2xl font-semibold mb-10">UrbanGent Admin</h2>

      <div className="space-y-6">
        <Link
          to="/admin"
          className="flex items-center gap-3 hover:text-gray-300"
        >
          <FiBarChart2 />
          Dashboard
        </Link>

        <Link
          to="/admin/products"
          className="flex items-center gap-3 hover:text-gray-300"
        >
          <FiBox />
          Products
        </Link>

        <Link
          to="/admin/create-product"
          className="flex items-center gap-3 hover:text-gray-300"
        >
          <FiPlus />
          Add Product
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center gap-3 hover:text-gray-300"
        >
          <FiUsers />
          Users
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;
