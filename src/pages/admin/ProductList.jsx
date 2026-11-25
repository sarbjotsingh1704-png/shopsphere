import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Edit } from 'lucide-react';
import api from '../../services/api';

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    const { data } = await api.get('/products', { params: { limit: 100 } });
    setProducts(data.products);
  };

  const loadCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data.categories);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/products', form);
        toast.success('Product created');
      }
      setForm({ name: '', price: '', stock: '', description: '', category: '' });
      setEditingId(null);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, price: p.price, stock: p.stock, description: p.description, category: p.category?._id });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted');
    loadProducts();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Manage Products</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-10 border rounded-lg p-6">
        <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-md px-3 py-2" />
        <input placeholder="Price" type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded-md px-3 py-2" />
        <input placeholder="Stock" type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border rounded-md px-3 py-2" />
        <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border rounded-md px-3 py-2">
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-md px-3 py-2 md:col-span-2" rows={3} />
        <button className="bg-primary text-white py-2 rounded-md md:col-span-2">
          {editingId ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="py-2">{p.name}</td>
              <td>${p.price}</td>
              <td>{p.stock}</td>
              <td className="flex gap-3 py-2">
                <button onClick={() => handleEdit(p)} className="text-blue-500"><Edit size={16} /></button>
                <button onClick={() => handleDelete(p._id)} className="text-red-500"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
