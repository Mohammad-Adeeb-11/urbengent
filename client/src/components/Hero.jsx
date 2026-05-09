import { useNavigate } from "react-router-dom";
import heroImage from "../assets/images/hero1.jpg";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-[70vh] sm:h-[75vh] md:h-[85vh] w-full">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center md:justify-start px-6 md:px-16 text-center md:text-left">
        <div className="max-w-xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            A Byte of <br />
            <span className="italic font-light">Trending Look</span>
          </h2>

          {/* Shop Button */}
          <button
            onClick={() => navigate("/shop")}
            className="mt-6 md:mt-8 bg-[#4F7CAC] hover:bg-[#3d6794] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-md shadow-lg transition duration-300 text-sm md:text-base"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
