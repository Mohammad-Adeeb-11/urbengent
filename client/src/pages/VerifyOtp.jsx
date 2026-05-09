import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/otp/verify",
        { email, otp: finalOtp },
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/welcome", { state: { userId: data._id } });
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[420px] p-10 rounded-lg shadow-md text-center">
        {/* Icon */}
        <div className="mb-6 text-5xl">📲</div>

        <h2 className="text-2xl font-semibold text-[#2E4A7D] mb-2">
          Verify with OTP
        </h2>

        <p className="text-gray-500 mb-8">Sent to {email}</p>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-4 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              ref={(el) => (inputs.current[index] = el)}
              className="w-12 h-14 border text-center text-xl rounded-md focus:border-[#2E4A7D] outline-none"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full bg-[#2E4A7D] hover:bg-[#243B55] text-white py-3 rounded-md font-semibold transition"
        >
          VERIFY
        </button>

        {/* Resend */}
        <p className="text-sm text-gray-500 mt-6">
          Resend OTP in <span className="font-medium text-black">00:30</span>
        </p>

        {/* Extra Links */}
        <p className="text-sm mt-6">
          Log in using{" "}
          <span className="text-[#2E4A7D] font-medium cursor-pointer">
            Password
          </span>
        </p>

        <p className="text-sm text-gray-500 mt-3">
          Having trouble logging in?{" "}
          <span className="text-[#2E4A7D] font-medium cursor-pointer">
            Get help
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
