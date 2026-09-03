import { useState } from "react";
import axios from "axios";
import { Heart, LoaderCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const [wishLoading, setWishLoading] = useState(false);
  const discount = product.oldPrice && Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  const addToWishlist = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo?.token) {
      alert("Please login first");
      return;
    }

    setWishLoading(true);
    try {
      await axios.post("http://localhost:5000/api/wishlist", { productId: product._id }, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      alert("Added to wishlist");
    } catch (error) {
      alert(error.response?.data?.message || "Could not add to wishlist");
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[1/1.12] overflow-hidden bg-slate-100">
        <Link to={`/product/${product._id}`}><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></Link>
        {discount > 0 && <span className="absolute left-2.5 top-2.5 rounded-full bg-[#16283f] px-2 py-1 text-[9px] font-semibold text-white">-{discount}%</span>}
        <button onClick={addToWishlist} disabled={wishLoading} aria-label="Add to wishlist" className="absolute right-2.5 top-2.5 rounded-full bg-white p-2 text-[#16283f] shadow-md transition hover:bg-[#e9b872] disabled:opacity-60">{wishLoading ? <LoaderCircle className="animate-spin" size={16} /> : <Heart size={16} />}</button>
      </div>
      <div className="p-3"><div className="flex items-center justify-between gap-2"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">{product.category}</p><span className="flex items-center gap-1 text-[11px] text-[#b77a2e]"><Star size={11} fill="currentColor" /> {Number(product.rating || 0).toFixed(1)}</span></div><Link to={`/product/${product._id}`}><h3 className="mt-1.5 line-clamp-2 min-h-9 text-sm font-semibold leading-5 text-[#16283f] hover:text-[#b77a2e]">{product.name}</h3></Link><div className="mt-2.5 flex items-center gap-2"><span className="text-sm font-semibold text-[#16283f]">₹{product.price}</span>{product.oldPrice && <span className="text-[11px] text-slate-400 line-through">₹{product.oldPrice}</span>}</div></div>
    </article>
  );
}

export default ProductCard;
