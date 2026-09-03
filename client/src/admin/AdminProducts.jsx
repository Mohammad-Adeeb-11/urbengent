import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Edit3, PackageOpen, Plus, Search, Trash2 } from "lucide-react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All categories",
    ...new Set(products.map((product) => product.category)),
  ];
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          category === "All categories" || product.category === category;
        return matchesSearch && matchesCategory;
      }),
    [category, products, search],
  );

  const deleteProductHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== id),
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b77a2e]">
            Catalog
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#16283f]">
            Products
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Organize and maintain everything your store sells.
          </p>
        </div>
        <Link
          to="/admin/create-product"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16283f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#243b55]"
        >
          <Plus size={17} /> Add product
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-[#b77a2e] focus-within:ring-2 focus-within:ring-[#b77a2e]/10">
          <Search size={18} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-[#b77a2e] focus:ring-2 focus:ring-[#b77a2e]/10"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
          <div>
            <h2 className="font-semibold text-[#16283f]">All products</h2>
            <p className="mt-1 text-xs text-slate-400">
              Showing {filteredProducts.length} of {products.length} items
            </p>
          </div>
          <PackageOpen size={20} className="text-[#b77a2e]" />
        </div>
        <div className="hidden grid-cols-[minmax(240px,1.5fr)_140px_130px_150px] gap-4 border-b border-slate-100 bg-slate-50/70 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 md:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Actions</span>
        </div>
        {loading ? (
          <p className="px-7 py-16 text-center text-sm text-slate-400">
            Loading products...
          </p>
        ) : filteredProducts.length ? (
          <div className="divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="grid gap-4 px-5 py-4 md:grid-cols-[minmax(240px,1.5fr)_140px_130px_150px] md:items-center md:px-7"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 shrink-0 rounded-lg bg-slate-100 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#16283f]">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 md:hidden">
                      {product.category}
                    </p>
                  </div>
                </div>
                <span className="hidden w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 md:block">
                  {product.category}
                </span>
                <div>
                  <span className="text-xs text-slate-400 md:hidden">
                    Price{" "}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    ₹{product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="ml-2 text-xs text-slate-400 line-through">
                      ₹{product.oldPrice}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/product/${product._id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-[#b77a2e] hover:text-[#b77a2e]"
                  >
                    <Edit3 size={14} /> Edit
                  </Link>
                  <button
                    disabled={deletingId === product._id}
                    onClick={() => deleteProductHandler(product._id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={14} />{" "}
                    {deletingId === product._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-7 py-16 text-center">
            <PackageOpen className="mx-auto text-slate-300" size={32} />
            <p className="mt-3 text-sm font-medium text-slate-500">
              No products found
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try another search or add a new product.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminProducts;
