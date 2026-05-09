import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { FiHeart, FiShoppingCart, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { FaTshirt } from "react-icons/fa";

import { GiTrousers } from "react-icons/gi";

import { MdOutlineNightlight } from "react-icons/md";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setUser(userInfo);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const fetchData = async () => {
        try {
          const cartRes = await axios.get(
            "http://localhost:5000/api/cart",
            config,
          );

          const total = cartRes.data.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );

          setCartCount(total);

          const wishRes = await axios.get(
            "http://localhost:5000/api/wishlist",
            config,
          );

          setWishlistCount(wishRes.data.length);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const searchHandler = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/shop?search=${search}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="px-6 md:px-16 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-semibold text-[#2E4A7D]">
          <span className="font-bold">UG</span>
          <span className="ml-2 font-light">UrbanGent</span>
        </Link>

        {/* DESKTOP CATEGORY */}
        <ul className="hidden lg:flex gap-10 text-sm font-semibold text-gray-700">
          <Link to="/shop?category=Shirts" className="hover:text-[#2E4A7D]">
            Shirts
          </Link>

          <Link to="/shop?category=Pants" className="hover:text-[#2E4A7D]">
            Pants
          </Link>

          <Link to="/shop?category=T-Shirts" className="hover:text-[#2E4A7D]">
            T-Shirts
          </Link>

          <Link to="/shop?category=Nightwear" className="hover:text-[#2E4A7D]">
            Nightwear
          </Link>
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          {/* DESKTOP SEARCH */}
          <form
            onSubmit={searchHandler}
            className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-md w-[260px]"
          >
            <FaSearch className="text-gray-500 mr-3" />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent w-full outline-none text-sm"
            />
          </form>

          {/* MOBILE SEARCH ICON */}
          <button
            className="md:hidden text-xl"
            onClick={() => setMobileSearch(!mobileSearch)}
          >
            <FaSearch />
          </button>

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="relative text-xl hover:text-[#2E4A7D]"
          >
            <FiHeart />

            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#2E4A7D] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link to="/cart" className="relative text-xl hover:text-[#2E4A7D]">
            <FiShoppingCart />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#2E4A7D] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* HAMBURGER */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      {mobileSearch && (
        <div className="md:hidden px-6 pb-4">
          <form
            onSubmit={searchHandler}
            className="flex items-center bg-gray-100 px-4 py-3 rounded-md"
          >
            <FaSearch className="text-gray-500 mr-3" />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent w-full outline-none text-sm"
            />
          </form>
        </div>
      )}

      {/* MOBILE MENU */}
      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SLIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <span className="text-xl font-semibold text-[#2E4A7D]">
            UrbanGent
          </span>

          <button onClick={() => setMenuOpen(false)} className="text-xl">
            <FiX />
          </button>
        </div>

        {/* MENU ITEMS */}
        <div className="flex flex-col py-6 text-gray-700 font-medium">
          <Link
            to="/account/profile"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100"
          >
            👤 Profile
          </Link>

          {/* <Link to="/account/profile">Profile</Link> */}

          <Link
            to="/shop?category=Shirts"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100"
          >
            <FaTshirt size={18} />
            Shirts
          </Link>

          <Link
            to="/shop?category=Pants"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100"
          >
            <GiTrousers size={18} />
            Pants
          </Link>

          <Link
            to="/shop?category=T-Shirts"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100"
          >
            <FaTshirt size={18} />
            T-Shirts
          </Link>

          <Link
            to="/shop?category=Nightwear"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100"
          >
            <MdOutlineNightlight size={18} />
            Nightwear
          </Link>

          <hr className="my-4" />

          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100"
          >
            <FiHeart size={18} />
            Wishlist
          </Link>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100"
          >
            <FiShoppingCart size={18} />
            Cart
          </Link>

          <hr className="my-4" />

          {user && (
            <button
              onClick={logoutHandler}
              className="flex items-center gap-4 px-6 py-3 hover:bg-gray-100 text-red-500"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
