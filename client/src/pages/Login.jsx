import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/otp/send", { email });

      navigate("/verify", { state: { email } });
    } catch (error) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[420px] p-10 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-8 text-[#2E4A7D]">
          Login <span className="text-gray-500 font-normal">with Email</span>
        </h2>

        {/* Email Input */}
        <form onSubmit={handleSendOtp}>
          <div className="border rounded-md px-4 py-3 mb-6 focus-within:border-[#2E4A7D] transition">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full bg-[#2E4A7D] hover:bg-[#243B55] text-white py-3 rounded-md font-semibold tracking-wide transition duration-300"
          >
            {loading ? "Sending..." : "SEND OTP"}
          </button>
        </form>

        {/* Help */}
        <p className="text-sm text-gray-600 mt-6">
          Having trouble logging in?{" "}
          <span className="text-[#2E4A7D] font-medium cursor-pointer hover:underline">
            Get help
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
