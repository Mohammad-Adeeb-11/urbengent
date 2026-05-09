import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <section className="py-16 px-4 md:px-10 lg:px-20 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2E4A7D] mb-10">
          Featured Collection
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse h-72 rounded-lg"
            ></div>
          ))}
        </div>
      </section>
    );

  if (error)
    return (
      <div className="py-20 text-center text-red-500 text-lg">{error}</div>
    );

  return (
    <section className="py-16 px-4 md:px-10 lg:px-20 bg-white">
      {/* SECTION TITLE */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#2E4A7D] mb-12">
          Featured Collection
        </h2>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
