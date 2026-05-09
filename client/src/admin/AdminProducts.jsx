import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchProducts = async () => {
    const { data } = await axios.get("http://localhost:5000/api/products");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProductHandler = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`http://localhost:5000/api/products/${id}`, config);

    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8 text-[#2E4A7D]">
        Products Management
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>

                <td className="p-4 font-medium">{product.name}</td>

                <td className="p-4 text-gray-600">₹{product.price}</td>

                <td className="p-4 space-x-3">
                  <Link
                    to={`/admin/product/${product._id}/edit`}
                    className="px-4 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProductHandler(product._id)}
                    className="px-4 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
