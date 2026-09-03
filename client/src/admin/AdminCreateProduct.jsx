import { useState } from "react";
import axios from "axios";
import { ImagePlus, LoaderCircle, Plus, Save, UploadCloud } from "lucide-react";

const initialForm = { name: "", price: "", oldPrice: "", description: "", image: "", category: "" };

function AdminCreateProduct() {
  const [form, setForm] = useState(initialForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setMessage("");
  };

  const uploadImageHandler = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    setMessage("");

    try {
      const { data } = await axios.post("http://localhost:5000/api/upload", formData);
      setForm((current) => ({ ...current, image: data.imageUrl }));
    } catch {
      setMessage("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!form.name || !form.category || !form.price || !form.image) {
      setMessage("Add a name, category, price, and product image before saving.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await axios.post("http://localhost:5000/api/products", form, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setForm(initialForm);
      setMessage("Product created successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not create product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      <header><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b77a2e]">Catalog / New item</p><h1 className="mt-2 text-3xl font-semibold text-[#16283f]">Create product</h1><p className="mt-2 text-sm text-slate-500">Bring a new piece into your UrbanGent collection.</p></header>
      <form onSubmit={submitHandler} className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5"><span className="rounded-lg bg-[#fbf3e5] p-2 text-[#b77a2e]"><Plus size={18} /></span><div><h2 className="font-semibold text-[#16283f]">Product details</h2><p className="text-xs text-slate-400">Give customers the information they need.</p></div></div>
          <div className="space-y-5">
            <Field label="Product name" required><input name="name" value={form.name} onChange={updateField} placeholder="e.g. Essential Oxford Shirt" className="input-style" /></Field>
            <Field label="Category" required><select name="category" value={form.category} onChange={updateField} className="input-style"><option value="">Select a category</option><option>Shirts</option><option>Pants</option><option>T-Shirts</option><option>Nightwear</option></select></Field>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Selling price" required><div className="relative"><span className="absolute left-4 top-3.5 text-sm text-slate-400">₹</span><input name="price" type="number" min="0" value={form.price} onChange={updateField} placeholder="0" className="input-style pl-8" /></div></Field><Field label="Compare-at price"><div className="relative"><span className="absolute left-4 top-3.5 text-sm text-slate-400">₹</span><input name="oldPrice" type="number" min="0" value={form.oldPrice} onChange={updateField} placeholder="0" className="input-style pl-8" /></div></Field></div>
            <Field label="Description"><textarea name="description" rows="7" value={form.description} onChange={updateField} placeholder="Describe the fit, material, and details..." className="input-style resize-none" /></Field>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="rounded-lg bg-[#eaf5f3] p-2 text-[#3f7774]"><ImagePlus size={18} /></span><div><h2 className="font-semibold text-[#16283f]">Product image</h2><p className="text-xs text-slate-400">Use a clear, high-quality image.</p></div></div><label className="group flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center hover:border-[#b77a2e] hover:bg-[#fffaf2]">{form.image ? <img src={form.image} alt="Product preview" className="h-64 w-full object-cover" /> : <><UploadCloud size={30} className="text-slate-400 group-hover:text-[#b77a2e]" /><p className="mt-3 text-sm font-semibold text-slate-600">Upload an image</p><p className="mt-1 text-xs text-slate-400">PNG, JPG up to 10MB</p></>}<input type="file" accept="image/*" onChange={uploadImageHandler} className="hidden" /></label>{uploading && <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[#b77a2e]"><LoaderCircle size={14} className="animate-spin" /> Uploading image...</p>}</section>
          <section className="rounded-xl border border-slate-200 bg-[#16283f] p-5 text-white shadow-sm sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e9b872]">Ready to publish?</p><p className="mt-2 text-sm leading-6 text-slate-300">Review the details and image, then add this product to your live catalog.</p>{message && <p className={`mt-4 rounded-lg px-3 py-2 text-xs ${message.includes("successfully") ? "bg-emerald-400/15 text-emerald-200" : "bg-red-400/15 text-red-200"}`}>{message}</p>}<button disabled={saving || uploading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e9b872] px-4 py-3 text-sm font-semibold text-[#16283f] hover:bg-[#f3ca8d] disabled:cursor-not-allowed disabled:opacity-60">{saving ? <><LoaderCircle size={17} className="animate-spin" /> Saving...</> : <><Save size={17} /> Create product</>}</button></section>
        </aside>
      </form>
    </main>
  );
}

function Field({ label, required, children }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-[#16283f]">{label}{required && <span className="ml-1 text-[#b77a2e]">*</span>}</span>{children}</label>;
}

export default AdminCreateProduct;
