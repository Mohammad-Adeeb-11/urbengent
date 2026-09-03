import { useEffect, useState } from "react";
import axios from "axios";
import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const categories = ["Shirts", "Pants", "T-Shirts", "Nightwear"];

function Shop() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const price = searchParams.get("price") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/api/products", {
          params: { search: searchQuery, category, price },
        });
        setProducts(data);
        setError("");
      } catch {
        setError("We could not load the catalog. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, category, price]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    value ? next.set(key, value) : next.delete(key);
    setSearchParams(next);
  };

  return (
    <main className="bg-[#f8fafb] px-4 py-10 sm:px-8 lg:px-16 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-slate-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b77a2e]">
            UrbanGent collection
          </p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#16283f]">
                Find your next staple.
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Thoughtful menswear for everyday confidence.
              </p>
            </div>
            <p className="text-sm text-slate-500">
              {loading ? "Finding pieces..." : `${products.length} pieces`}
            </p>
          </div>
        </header>
        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#16283f]">Filters</h2>
              <SlidersHorizontal size={17} className="text-[#b77a2e]" />
            </div>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Category
              </p>
              <div className="mt-3 space-y-1">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      updateFilter("category", category === item ? "" : item)
                    }
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${category === item ? "bg-[#16283f] font-semibold text-white" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {item}
                    {category === item && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Maximum price
              </p>
              <select
                value={price}
                onChange={(event) => updateFilter("price", event.target.value)}
                className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-[#b77a2e]"
              >
                <option value="">Any price</option>
                <option value="500">Below ₹500</option>
                <option value="1000">Below ₹1,000</option>
                <option value="2000">Below ₹2,000</option>
              </select>
            </div>
            {(category || price || searchQuery) && (
              <button
                onClick={() => setSearchParams({})}
                className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-[#b77a2e] hover:text-[#16283f]"
              >
                Clear filters <X size={14} />
              </button>
            )}
          </aside>
          <section>
            {error ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center text-sm text-red-600">
                {error}
              </div>
            ) : loading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
                <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
                <div className="hidden h-72 animate-pulse rounded-xl bg-slate-200 md:block" />
              </div>
            ) : products.length ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-20 text-center">
                <h2 className="text-lg font-semibold text-[#16283f]">
                  No pieces match those filters
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Try clearing a filter to explore the full collection.
                </p>
                <button
                  onClick={() => setSearchParams({})}
                  className="mt-5 rounded-lg bg-[#16283f] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  View all products
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Shop;
