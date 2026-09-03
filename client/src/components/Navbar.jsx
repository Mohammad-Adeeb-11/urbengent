import { useEffect, useState } from "react";
import axios from "axios";
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const categories = ["Shirts", "Pants", "T-Shirts", "Nightwear"];

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.token) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      try {
        const [cartResponse, wishlistResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/cart", config),
          axios.get("http://localhost:5000/api/wishlist", config),
        ]);
        setCartCount(
          (cartResponse.data.items || []).reduce(
            (total, item) => total + item.quantity,
            0,
          ),
        );
        setWishlistCount((wishlistResponse.data.products || []).length);
      } catch {
        setCartCount(0);
        setWishlistCount(0);
      }
    };
    fetchCounts();
  }, [location.pathname, user?.token]);

  const closeMenu = () => setMenuOpen(false);
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    closeMenu();
    navigate("/");
  };
  const searchHandler = (event) => {
    event.preventDefault();
    navigate(
      search.trim()
        ? `/shop?search=${encodeURIComponent(search.trim())}`
        : "/shop",
    );
    setSearchOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-6 px-5 sm:px-8 lg:px-12">
          <Link to="/" className="shrink-0 text-[#16283f]">
            <span className="text-xl font-bold tracking-[0.12em]">UG</span>
            <span className="ml-2 text-lg font-light tracking-wide sm:text-xl">
              UrbanGent
            </span>
          </Link>
          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/shop?category=${category}`}
                className="relative py-2 text-sm font-semibold text-slate-600 transition hover:text-[#b77a2e]"
              >
                {category}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <form
              onSubmit={searchHandler}
              className="hidden h-10 w-56 items-center gap-2 rounded-lg bg-slate-100 px-3 xl:flex"
            >
              <Search size={17} className="text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </form>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="rounded-lg p-2.5 text-slate-600 hover:bg-slate-100 xl:hidden"
            >
              <Search size={19} />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative rounded-lg p-2.5 text-slate-600 hover:bg-slate-100 hover:text-[#b77a2e]"
            >
              <Heart size={20} />
              {wishlistCount > 0 && <Badge value={wishlistCount} />}
            </Link>
            <Link
              to="/cart"
              aria-label="Shopping bag"
              className="relative rounded-lg p-2.5 text-slate-600 hover:bg-slate-100 hover:text-[#b77a2e]"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <Badge value={cartCount} />}
            </Link>
            {user ? (
              <Link
                to="/account/profile"
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-[#16283f] md:flex"
              >
                <UserRound size={18} />
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-lg bg-[#16283f] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#243b55] sm:flex"
              >
                <LogIn size={17} />
                Log in
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-slate-100 px-5 py-3 xl:hidden">
            <form
              onSubmit={searchHandler}
              className="flex h-10 items-center gap-2 rounded-lg bg-slate-100 px-3"
            >
              <Search size={17} className="text-slate-500" />
              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent text-sm outline-none"
              />
            </form>
          </div>
        )}
      </nav>
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-[#16283f]/50"
          onClick={closeMenu}
        >
          <aside
            className="ml-auto flex h-full w-[min(86vw,360px)] flex-col bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <Link
                to="/"
                onClick={closeMenu}
                className="text-lg font-semibold text-[#16283f]"
              >
                UrbanGent
              </Link>
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-6 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/shop?category=${category}`}
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#b77a2e]"
                >
                  {category}
                </Link>
              ))}
              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Heart size={18} />
                Wishlist
              </Link>
              <Link
                to="/cart"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <ShoppingBag size={18} />
                Shopping bag
              </Link>
              <Link
                to={user ? "/account/profile" : "/login"}
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <UserRound size={18} />
                {user ? "Profile" : "Log in"}
              </Link>
            </div>
            <div className="mt-auto border-t border-slate-100 pt-5">
              {user && (
                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-red-500 hover:text-red-700"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function Badge({ value }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b77a2e] px-1 text-[9px] font-bold text-white">
      {value}
    </span>
  );
}

export default Navbar;
