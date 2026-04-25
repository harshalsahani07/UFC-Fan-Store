import { useEffect, useState } from "react";
import api from "../api/client";

const initial = { name: "", description: "", price: 0, stock: 0, category: "Merchandise" };

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initial);

  const load = () => api.get("/products").then((res) => setProducts(res.data));
  useEffect(() => {
    load();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    await api.post("/admin/products", { ...form, price: Number(form.price), stock: Number(form.stock) });
    setForm(initial);
    load();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Product Management</h2>
      <form onSubmit={createProduct} className="grid md:grid-cols-5 gap-2 mb-4">
        <input className="border p-2 text-black" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 text-black" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="border p-2 text-black" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="border p-2 text-black" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <button className="bg-red-600 text-white rounded p-2" type="submit">
          Add
        </button>
      </form>
      {products.map((p) => (
        <div key={p._id} className="border rounded p-2 mb-2">
          {p.name} - ${p.price} - Stock: {p.stock}
        </div>
      ))}
    </div>
  );
};

export default AdminProductsPage;
