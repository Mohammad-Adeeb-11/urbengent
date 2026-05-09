import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [users, setUsers] = useState(0);
  const [products, setProducts] = useState(0);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchStats = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const usersRes = await axios.get(
        "http://localhost:5000/api/users",
        config,
      );

      const productsRes = await axios.get("http://localhost:5000/api/products");

      setUsers(usersRes.data.length);
      setProducts(productsRes.data.length);
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "Users", value: users },
    { name: "Products", value: products },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-10 text-[#2E4A7D]">
        Admin Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-gray-500 text-sm mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-[#2E4A7D]">{users}</p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-gray-500 text-sm mb-2">Total Products</h2>
          <p className="text-3xl font-bold text-[#2E4A7D]">{products}</p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-gray-500 text-sm mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-[#2E4A7D]">0</p>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white shadow rounded p-6 h-[400px]">
        <h2 className="text-xl font-semibold mb-6 text-[#2E4A7D]">
          Platform Statistics
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;
