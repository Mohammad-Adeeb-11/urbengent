import { useState } from "react";
import axios from "axios";

function AdminCreateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
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

    await axios.post(
      "http://localhost:5000/api/products",
      { name, price, oldPrice, image, description, category },
      config,
    );

    alert("Product Created!");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-3 sm:p-5 md:p-8">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2E4A7D]">
            Create Product
          </h1>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Add new products to your store
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2E4A7D] text-sm sm:text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">
              Category
            </label>

            <select
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2E4A7D] text-sm sm:text-base"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Shirts">Shirts</option>
              <option value="Pants">Pants</option>
              <option value="T-Shirts">T-Shirts</option>
              <option value="Nightwear">Nightwear</option>
            </select>
          </div>

          {/* Price Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-sm sm:text-base">
                Price
              </label>

              <input
                type="number"
                placeholder="₹ Enter price"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2E4A7D] text-sm sm:text-base"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm sm:text-base">
                Old Price
              </label>

              <input
                type="number"
                placeholder="₹ Old price"
                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2E4A7D] text-sm sm:text-base"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">
              Description
            </label>

            <textarea
              rows="5"
              placeholder="Write product description..."
              className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2E4A7D] resize-none text-sm sm:text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block mb-2 font-medium text-sm sm:text-base">
              Upload Product Image
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center">
              <input
                type="file"
                onChange={uploadImageHandler}
                className="w-full text-sm"
              />

              {uploading && (
                <p className="mt-3 text-blue-600 font-medium">Uploading...</p>
              )}

              {image && (
                <div className="mt-5 flex justify-center">
                  <img
                    src={image}
                    alt="preview"
                    className="w-full max-w-xs h-52 object-cover rounded-xl shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#2E4A7D] hover:bg-[#243b63] transition-all duration-300 text-white py-3 rounded-xl font-semibold text-sm sm:text-base"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateProduct;
