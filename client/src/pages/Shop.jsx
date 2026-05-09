import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Shop() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  const [category, setCategory] = useState(categoryQuery);
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/products?search=${searchQuery}&category=${category}&price=${price}`,
      );

      setProducts(data);
    };

    fetchProducts();
  }, [searchQuery, category, price]);

  return (
    <div className="bg-white py-10 px-4 md:px-10 lg:px-20">
      {/* PAGE TITLE */}
      <h1 className="text-2xl md:text-3xl font-semibold text-[#2E4A7D] mb-8">
        Shop
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* FILTERS */}
        <div className="bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-md space-y-8">
          {/* CATEGORY FILTER */}
          <div>
            <h3 className="font-semibold mb-3">Category</h3>

            {["Shirts", "Pants", "T-Shirts", "Nightwear"].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 mb-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />

                <span className="text-sm">{cat}</span>
              </label>
            ))}

            <button
              className="text-sm text-blue-500 mt-2"
              onClick={() => setCategory("")}
            >
              Clear
            </button>
          </div>

          {/* PRICE FILTER */}
          <div>
            <h3 className="font-semibold mb-3">Price</h3>

            <select
              className="border p-2 rounded w-full text-sm"
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value="">All</option>
              <option value="500">Below ₹500</option>
              <option value="1000">Below ₹1000</option>
              <option value="2000">Below ₹2000</option>
            </select>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="md:col-span-3">
          {products.length === 0 ? (
            <p className="text-gray-500">No products found</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
