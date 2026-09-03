import { useEffect, useState } from "react";
import axios from "axios";
import { Check, Edit3, LoaderCircle, MapPin, Plus, Trash2, X } from "lucide-react";

const emptyForm = { label: "Home", fullName: "", phone: "", address: "", city: "", state: "", postalCode: "" };

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users/addresses", { headers });
        setAddresses(data);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const editAddress = (address) => { setForm(address); setEditingId(address._id); setMessage(""); };
  const cancelEdit = () => { setForm(emptyForm); setEditingId(""); setMessage(""); };
  const saveAddress = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const url = editingId ? `http://localhost:5000/api/users/addresses/${editingId}` : "http://localhost:5000/api/users/addresses";
      const { data } = await axios({ method: editingId ? "put" : "post", url, data: form, headers });
      setAddresses((current) => editingId ? current.map((item) => item._id === editingId ? data : item) : [...current, data]);
      setMessage(editingId ? "Address updated." : "Address added.");
      setForm(emptyForm);
      setEditingId("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save address.");
    } finally {
      setSaving(false);
    }
  };
  const deleteAddress = async (id) => { if (!window.confirm("Remove this address?")) return; await axios.delete(`http://localhost:5000/api/users/addresses/${id}`, { headers }); setAddresses((current) => current.filter((item) => item._id !== id)); };

  if (loading) return <div className="py-16 text-center text-sm text-slate-500">Loading addresses...</div>;
  return <div><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b77a2e]">Delivery book</p><h2 className="mt-2 text-2xl font-semibold text-[#16283f]">Addresses</h2><p className="mt-1 text-sm text-slate-500">Save delivery details for a faster checkout.</p></div><MapPin size={21} className="text-[#b77a2e]" /></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{addresses.map((address) => <article key={address._id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between"><span className="rounded-full bg-[#eaf5f3] px-3 py-1 text-xs font-semibold text-[#3f7774]">{address.label || "Address"}</span><div className="flex gap-1"><button onClick={() => editAddress(address)} aria-label="Edit address" className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-[#b77a2e]"><Edit3 size={15} /></button><button onClick={() => deleteAddress(address._id)} aria-label="Delete address" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button></div></div><p className="mt-4 text-sm font-semibold text-[#16283f]">{address.fullName}</p><p className="mt-1 text-sm leading-6 text-slate-500">{address.address}<br />{address.city}, {address.state} {address.postalCode}<br />{address.phone}</p></article>)}</div><form onSubmit={saveAddress} className="mt-7 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6"><div className="flex items-center justify-between"><h3 className="font-semibold text-[#16283f]">{editingId ? "Edit address" : "Add a new address"}</h3>{editingId && <button type="button" onClick={cancelEdit} className="flex items-center gap-1 text-xs font-semibold text-slate-500"><X size={14} /> Cancel</button>}</div><div className="mt-5 grid gap-4 sm:grid-cols-2">{[["label", "Label"], ["fullName", "Full name"], ["phone", "Phone number"], ["address", "Street address"], ["city", "City"], ["state", "State"], ["postalCode", "Postal code"]].map(([name, label]) => <label key={name} className={name === "address" ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-xs font-semibold text-[#16283f]">{label}</span><input required name={name} value={form[name]} onChange={updateField} className="input-style bg-white" /></label>)}</div>{message && <p className="mt-4 flex items-center gap-2 text-sm text-[#3f7774]"><Check size={15} /> {message}</p>}<button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#16283f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />} {editingId ? "Update address" : "Save address"}</button></form></div>;
}
export default Addresses;
