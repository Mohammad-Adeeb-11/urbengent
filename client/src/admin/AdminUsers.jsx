import { useEffect, useState } from "react";
import axios from "../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        "/api/users",
        config,
      );

      setUsers(data);
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    if (window.confirm("Delete this user?")) {
      await axios.delete(`/api/users/${id}`, config);

      setUsers(users.filter((user) => user._id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8 text-[#2E4A7D]">
        Users Management
      </h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-3">{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Admin" : "User"}</td>

              <td>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
