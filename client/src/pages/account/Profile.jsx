import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Camera,
  Check,
  Heart,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Save,
} from "lucide-react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await axios.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
      setName(data.name || "");
      setAvatar(data.avatar || "");
    };
    fetchProfile();
  }, [token]);

  const uploadAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await axios.post(
        "/api/upload",
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAvatar(data.imageUrl);
    } catch {
      setMessage("Could not upload your profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const updateHandler = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const { data } = await axios.put(
        `/api/users/${user._id}`,
        { name: name.trim(), avatar },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUser(data);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...userInfo, name: data.name, avatar: data.avatar }),
      );
      setMessage("Profile saved successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not save your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user)
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Loading profile...
      </div>
    );
  const initial = name.charAt(0).toUpperCase() || "U";
  return (
    <div>
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b77a2e]">
            Account details
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#16283f]">
            Personal information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your photo and the name shown on your account.
          </p>
        </div>
        <div className="hidden rounded-lg bg-[#eaf5f3] p-2 text-[#3f7774] sm:block">
          <LockKeyhole size={18} />
        </div>
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          to="/account/addresses"
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:border-[#b77a2e] hover:text-[#b77a2e]"
        >
          <MapPin size={17} /> Manage addresses
        </Link>
        <Link
          to="/account/wishlist"
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:border-[#b77a2e] hover:text-[#b77a2e]"
        >
          <Heart size={17} /> View wishlist
        </Link>
      </div>
      <form onSubmit={updateHandler} className="mt-8 max-w-xl space-y-5">
        <div>
          <span className="mb-3 block text-sm font-semibold text-[#16283f]">
            Profile picture
          </span>
          <div className="flex items-center gap-4">
            <label className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#e9b872] text-2xl font-semibold text-[#16283f]">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-[#16283f]/70 text-white opacity-0 transition group-hover:opacity-100">
                <Camera size={20} />
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </label>
            <div>
              <p className="text-sm font-medium text-[#16283f]">
                Choose a new picture
              </p>
              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG, or WEBP. Your image is stored securely.
              </p>
              {uploading && (
                <p className="mt-2 flex items-center gap-1 text-xs text-[#b77a2e]">
                  <LoaderCircle size={13} className="animate-spin" />{" "}
                  Uploading...
                </p>
              )}
            </div>
          </div>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#16283f]">
            Full name
          </span>
          <input
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setMessage("");
            }}
            className="input-style"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#16283f]">
            Email address
          </span>
          <input
            value={user.email}
            disabled
            className="input-style cursor-not-allowed bg-slate-50 text-slate-400"
          />
          <span className="mt-2 block text-xs text-slate-400">
            Your email is used for login and cannot be changed here.
          </span>
        </label>
        {message && (
          <p
            className={`flex items-center gap-2 text-sm ${message.includes("successfully") ? "text-[#3f7774]" : "text-red-500"}`}
          >
            {message.includes("successfully") && <Check size={16} />} {message}
          </p>
        )}
        <button
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#16283f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#243b55] disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}{" "}
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
export default Profile;
