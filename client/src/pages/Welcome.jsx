import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

function Welcome() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;

  const handleContinue = async () => {
    try {
      await axios.put(`/api/users/${userId}`, { name });

      navigate("/");
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[420px] rounded-lg shadow-md overflow-hidden">
        {/* Success Banner */}
        <div className="bg-green-100 p-6 text-center">
          <div className="text-3xl mb-2">✅</div>
          <h2 className="text-lg font-semibold text-[#2E4A7D]">
            Welcome to UrbanGent
          </h2>
          <p className="text-sm text-gray-600">Your account has been created</p>
        </div>

        {/* Name Section */}
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-6 text-[#2E4A7D]">
            What should we call you?
          </h3>

          <input
            type="text"
            placeholder="Type your name (Optional)"
            className="w-full border px-4 py-3 rounded-md mb-6 focus:border-[#2E4A7D] outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={handleContinue}
            className="w-full bg-[#2E4A7D] hover:bg-[#243B55] text-white py-3 rounded-md font-semibold transition"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
