import { createElement, useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowUpRight,
  BarChart3,
  Box,
  CheckCircle2,
  Clock3,
  Plus,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartColors = ["#16283f", "#b77a2e", "#5c8d89", "#c96b4b", "#8c6a9e"];

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [usersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users", config),
          axios.get("http://localhost:5000/api/products"),
        ]);

        setUsers(usersRes.data);
        setProducts(productsRes.data);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const categoryData = Object.entries(
    products.reduce((categories, product) => {
      categories[product.category] = (categories[product.category] || 0) + 1;
      return categories;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const averagePrice = products.length
    ? Math.round(
        products.reduce(
          (total, product) => total + Number(product.price || 0),
          0,
        ) / products.length,
      )
    : 0;
  const averageRating = products.length
    ? (
        products.reduce(
          (total, product) => total + Number(product.rating || 0),
          0,
        ) / products.length
      ).toFixed(1)
    : "0.0";
  const recentProducts = [...products]
    .sort(
      (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
    )
    .slice(0, 5);
  const topProducts = [...products]
    .sort((first, second) => (second.rating || 0) - (first.rating || 0))
    .slice(0, 4);
  const statCards = [
    {
      label: "Total products",
      value: products.length,
      note: "In your catalog",
      icon: Box,
      color: "text-[#b77a2e] bg-[#fbf3e5]",
    },
    {
      label: "Total customers",
      value: users.length,
      note: "Registered accounts",
      icon: Users,
      color: "text-[#3f7774] bg-[#eaf5f3]",
    },
    {
      label: "Average rating",
      value: averageRating,
      note: "Across all products",
      icon: Star,
      color: "text-[#9a6b18] bg-[#fff7d9]",
    },
    {
      label: "Average price",
      value: `₹${averagePrice}`,
      note: "Catalog average",
      icon: BarChart3,
      color: "text-[#b45d42] bg-[#fff0eb]",
    },
  ];

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-[#16283f] px-6 py-7 text-white shadow-xl shadow-[#16283f]/10 sm:px-8 sm:py-9">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e9b872]">
            Thursday, store report
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Good morning, {userInfo?.name || "admin"}.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
            Keep your catalog fresh, understand your audience, and make every
            product count.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/admin/create-product"
              className="inline-flex items-center gap-2 rounded-lg bg-[#e9b872] px-4 py-2.5 text-sm font-semibold text-[#16283f] hover:bg-[#f3ca8d]"
            >
              <Plus size={17} /> Add product
            </Link>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              View catalog <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[36px] border-[#b77a2e]/20" />
        <div className="absolute -bottom-28 right-28 h-60 w-60 rounded-full border border-white/10" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, note, icon: Icon, color }) => (
          <article
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <span className={`rounded-lg p-2 ${color}`}>
                {createElement(Icon, { size: 18 })}
              </span>
            </div>
            <p className="mt-5 text-3xl font-semibold text-[#16283f]">
              {loading ? "--" : value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#16283f]">
                Catalog snapshot
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Products grouped by category.
              </p>
            </div>
            <Box size={20} className="text-[#b77a2e]" />
          </div>
          <div className="mt-7 h-64">
            {categoryData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid vertical={false} stroke="#eef2f6" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar
                    dataKey="value"
                    fill="#b77a2e"
                    radius={[5, 5, 0, 0]}
                    barSize={34}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState label="Add products to see your catalog mix." />
            )}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#16283f]">
                Category mix
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Share of your inventory.
              </p>
            </div>
            <ShoppingBag size={20} className="text-[#3f7774]" />
          </div>
          <div className="relative mt-2 h-56">
            {categoryData.length ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={84}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold text-[#16283f]">
                    {products.length}
                  </span>
                  <span className="text-xs text-slate-400">items</span>
                </div>
              </>
            ) : (
              <EmptyState label="No category data yet." />
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {categoryData.slice(0, 4).map((category, index) => (
              <div
                key={category.name}
                className="flex items-center gap-2 text-xs text-slate-500"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
                {category.name}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
            <div>
              <h2 className="text-lg font-semibold text-[#16283f]">
                Recently added
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest catalog activity.
              </p>
            </div>
            <Link
              to="/admin/products"
              className="text-sm font-semibold text-[#b77a2e] hover:text-[#16283f]"
            >
              See all
            </Link>
          </div>
          {recentProducts.length ? (
            <div className="divide-y divide-slate-100">
              {recentProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 px-5 py-4 sm:px-7"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#16283f]">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {product.category}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    ₹{product.price}
                  </p>
                  <CheckCircle2
                    size={17}
                    className="hidden text-[#3f7774] sm:block"
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="Your newest products will appear here." />
          )}
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#16283f]">
                Top rated
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Products customers love most.
              </p>
            </div>
            <Star size={20} className="text-[#d39b2f]" />
          </div>
          <div className="mt-5 space-y-4">
            {topProducts.length ? (
              topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center gap-3">
                  <span className="w-4 text-xs font-semibold text-slate-400">
                    0{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#16283f]">
                      {product.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#d39b2f]">
                      <Star size={12} fill="currentColor" />{" "}
                      {Number(product.rating || 0).toFixed(1)}{" "}
                      <span className="text-slate-400">
                        ({product.numReviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState label="Ratings will appear as customers review products." />
            )}
          </div>
          <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
            <Clock3 size={14} /> Live catalog insights
          </div>
        </article>
      </section>
    </main>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex h-full min-h-32 items-center justify-center text-center text-sm text-slate-400">
      {label}
    </div>
  );
}

export default AdminDashboard;
