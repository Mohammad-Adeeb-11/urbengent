import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* Counter Component */
function Counter({ end }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [end]);

  return <span>{count}+</span>;
}

function About() {
  return (
    <div className="bg-white overflow-hidden">
      {/* PARALLAX HERO */}
      <section className="relative h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59"
          alt="UrbanGent Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Light Overlay (for readability only) */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 leading-tight">
            Crafted for the Modern Gentleman
          </h1>

          <p className="text-lg md:text-xl text-gray-200">
            Premium minimal fashion designed with elegance and confidence.
          </p>
        </div>
      </section>

      {/* GLASS STORY SECTION */}
      <section className="py-24 px-6 md:px-20 bg-gradient-to-b from-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl text-[#2E4A7D] mb-8">
            Our Story
          </h2>

          <p className="text-gray-600 leading-8 text-lg">
            UrbanGent was founded with a clear vision — to redefine men’s
            fashion through minimalism, craftsmanship and confidence. We believe
            true style is timeless and speaks through simplicity.
          </p>
        </motion.div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 px-6 md:px-20 bg-white">
        <h2 className="text-3xl md:text-4xl text-[#2E4A7D] text-center mb-16">
          Our Journey
        </h2>

        <div className="max-w-4xl mx-auto relative border-l-2 border-[#2E4A7D] pl-10 space-y-16">
          {[
            {
              year: "2024",
              text: "UrbanGent was conceptualized with a premium fashion vision.",
            },
            {
              year: "2025",
              text: "Launched our first minimal collection.",
            },
            {
              year: "2026",
              text: "Built a full MERN powered e-commerce platform.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -left-14 top-2 w-6 h-6 bg-[#2E4A7D] rounded-full border-4 border-white"></div>
              <h3 className="text-xl font-semibold text-[#2E4A7D] mb-2">
                {item.year}
              </h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ANIMATED STATS */}
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="text-3xl md:text-4xl text-[#2E4A7D] mb-16">
          Our Impact
        </h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-10">
            <h3 className="text-5xl font-bold text-[#2E4A7D] mb-4">
              <Counter end={1500} />
            </h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-10">
            <h3 className="text-5xl font-bold text-[#2E4A7D] mb-4">
              <Counter end={50} />
            </h3>
            <p className="text-gray-600">Premium Designs</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-10">
            <h3 className="text-5xl font-bold text-[#2E4A7D] mb-4">
              <Counter end={3} />
            </h3>
            <p className="text-gray-600">Years of Vision</p>
          </div>
        </div>
      </section>

      {/* FOUNDER GLASS SECTION */}
      <section className="py-24 px-6 md:px-20 bg-[#2E4A7D] text-white text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12"
        >
          <h2 className="text-3xl md:text-4xl mb-6">Built by Passion</h2>

          <p className="text-lg text-gray-200 leading-8">
            Founded by Mohammad Adeeb, UrbanGent merges technology and fashion
            to create a premium digital-first shopping experience powered by
            MERN.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default About;
