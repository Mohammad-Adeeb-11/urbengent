import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${id}`);

      setName(data.name);
      setPrice(data.price);
      setOldPrice(data.oldPrice);
      setDescription(data.description);
      setImage(data.image);
      setCategory(data.category);
    };

    fetchProduct();
  }, [id]);

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const { data } = await axios.post(
        "/api/upload",
        formData,
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );

      setImage(data.imageUrl);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.put(
      `/api/products/${id}`,
      {
        name,
        price,
        oldPrice,
        description,
        image,
        category,
      },
      config,
    );

    alert("Product Updated");

    navigate("/admin/products");
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-semibold mb-8 text-[#2E4A7D]">
        Edit Product
      </h1>

      <form onSubmit={submitHandler} className="space-y-5">
        <input
          type="text"
          className="w-full border p-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
        />

        {/* CATEGORY */}
        <select
          className="w-full border p-3 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Shirts">Shirts</option>
          <option value="Pants">Pants</option>
          <option value="T-Shirts">T-Shirts</option>
          <option value="Nightwear">Nightwear</option>
        </select>

        <input
          type="number"
          className="w-full border p-3 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />

        <input
          type="number"
          className="w-full border p-3 rounded"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
          placeholder="Old Price"
        />

        <textarea
          className="w-full border p-3 rounded"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        {/* IMAGE UPLOAD */}
        <div>
          <input type="file" onChange={uploadImageHandler} />

          {uploading && <p>Uploading...</p>}

          {image && (
            <img
              src={image}
              alt="preview"
              className="mt-3 h-32 object-cover rounded"
            />
          )}
        </div>

        <button className="bg-[#2E4A7D] text-white px-6 py-3 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default AdminEditProduct;
