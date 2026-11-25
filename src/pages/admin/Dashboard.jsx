import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, Users } from 'lucide-react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get('/orders');
        setStats({ orders: data.count, revenue: data.totalAmount });
      } catch (err) {
        console.error(err);
      }
    };
    loadStats();
  }, []);

  const cards = [
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag },
    { label: 'Total Revenue', value: `$${stats.revenue?.toFixed(2) || 0}`, icon: DollarSign },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="border rounded-lg p-6 flex items-center gap-4">
            <c.icon className="text-accent" size={32} />
            <div>
              <p className="text-gray-500 text-sm">{c.label}</p>
              <p className="text-xl font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link to="/admin/products" className="bg-primary text-white px-6 py-3 rounded-md flex items-center gap-2">
          <Package size={18} /> Manage Products
        </Link>
      </div>
    </div>
  );
}
