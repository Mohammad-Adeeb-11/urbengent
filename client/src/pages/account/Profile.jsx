import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const fetchProfile = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/users/profile",
        config,
      );

      setUser(data);
      setName(data.name);
    };

    fetchProfile();
  }, []);

  const updateHandler = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `http://localhost:5000/api/users/${user._id}`,
      { name },
      config,
    );

    alert("Profile Updated");
    setUser(data);
  };

  if (!user) {
    return (
      <div className="text-center py-32 text-[#2E4A7D]">Loading profile...</div>
    );
  }

  return (
    <div className="px-6 md:px-20 py-16 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-semibold mb-8 text-[#2E4A7D]">
          My Profile
        </h1>

        <form onSubmit={updateHandler} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded-md"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>

            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border p-3 rounded-md bg-gray-100"
            />
          </div>

          {/* BUTTON */}
          <button className="w-full bg-[#2E4A7D] text-white py-3 rounded-md hover:bg-[#243B55]">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
