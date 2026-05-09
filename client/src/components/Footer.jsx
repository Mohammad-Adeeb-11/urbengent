import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative mt-24 text-white">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 pointer-events-none">
        <svg
          className="relative block w-full h-14 md:h-16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19
            c-82.26-17.34-168.06-16.33-250.45.39
            C413.43,31,331.1,72,250.34,92.83
            162.76,115.45,81.45,108.39,0,92.83V0H1200V92.83Z"
            className="fill-[#243B55]"
          />
        </svg>
      </div>

      {/* Main Footer */}
      <div className="bg-gradient-to-r from-[#243B55] to-[#2E4A7D] pt-24 pb-16 px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left"
        >
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide mb-4">
              UrbanGent
            </h2>

            <p className="text-sm text-white/80 leading-6 max-w-xs">
              Timeless menswear designed with precision, subtlety, and
              understated luxury.
            </p>

            <div className="flex gap-6 mt-6 text-xl">
              <a
                href="https://github.com/Mohammad-Adeeb-11"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:scale-110 hover:text-gray-300"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/adeeb-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:scale-110 hover:text-sky-300"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm tracking-[0.25em] text-white/90 font-medium mb-6">
              SHOP
            </h3>

            <ul className="space-y-3 text-sm">
              {["Shirts", "Pants", "T-Shirts", "Nightwear"].map((item) => (
                <li
                  key={item}
                  className="group cursor-pointer relative w-fit mx-auto sm:mx-0"
                >
                  <span className="transition group-hover:text-white">
                    {item}
                  </span>
                  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all group-hover:w-full"></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm tracking-[0.25em] text-white/90 font-medium mb-6">
              COMPANY
            </h3>

            <ul className="space-y-3 text-sm">
              {[
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms", path: "/terms" },
              ].map((item) => (
                <li
                  key={item.name}
                  className="group relative w-fit mx-auto sm:mx-0"
                >
                  <Link to={item.path} className="transition hover:text-white">
                    {item.name}
                  </Link>

                  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-white transition-all group-hover:w-full"></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-sm tracking-[0.25em] text-white/90 font-medium mb-6">
              NEWSLETTER
            </h3>

            <p className="text-sm text-white/80 mb-4 text-center sm:text-left">
              Subscribe for exclusive releases and updates.
            </p>

            <div className="flex flex-col sm:flex-row w-full border border-white/40 rounded-sm overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent px-4 py-3 text-sm w-full focus:outline-none placeholder-white/60"
              />

              <button className="px-6 py-3 text-xs tracking-[0.2em] hover:bg-white hover:text-[#243B55] transition">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="border-t border-white/20 mt-14 pt-6 text-center text-xs md:text-sm text-white/70 space-y-3"
        >
          <p>© {new Date().getFullYear()} UrbanGent. All rights reserved.</p>

          <p className="flex flex-wrap items-center justify-center gap-2">
            Designed & Engineered with
            <FaHeart className="text-red-400 animate-pulse" />
            by
            <a
              href="https://www.linkedin.com/in/adeeb-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-sky-300 transition"
            >
              Mohammad Adeeb
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
