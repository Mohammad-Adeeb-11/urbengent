import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const users = await axios.get(
          "/api/users",
          config,
        );

        const products = await axios.get(
          "/api/products",
          config,
        );

        const orders = await axios.get(
          "/api/orders",
          config,
        );

        setStats({
          users: users.data.length,
          products: products.data.length,
          orders: orders.data.length,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: "Jan", orders: 12, revenue: 4000 },
    { name: "Feb", orders: 19, revenue: 7000 },
    { name: "Mar", orders: 10, revenue: 3000 },
    { name: "Apr", orders: 22, revenue: 9000 },
    { name: "May", orders: 15, revenue: 6000 },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-[#2E4A7D] mb-8">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold text-[#2E4A7D]">{stats.users}</h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Products</p>
          <h2 className="text-3xl font-bold text-[#2E4A7D]">
            {stats.products}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-3xl font-bold text-[#2E4A7D]">{stats.orders}</h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-[#2E4A7D]">Orders Overview</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#2E4A7D" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4 text-[#2E4A7D]">
            Revenue Overview
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="revenue" stroke="#2E4A7D" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
