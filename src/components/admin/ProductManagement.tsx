'use client';

import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/lib/supabase';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

export default function AdminProducts() {
  const { products, setProducts } = useProducts();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: number) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Example only – build a form for add/edit
  const handleAdd = async () => {
    const { data, error } = await supabase.from('products').insert([
      {
        name: 'New Product',
        category: 'Dresses',
        price: 1999,
        original_price: 2499,
        image: 'https://via.placeholder.com/200',
        sizes: ['S', 'M'],
        colors: ['Red', 'Blue'],
        stock: 10,
        rating: 0,
        reviews: 0,
        featured: false,
      },
    ]).select();

    if (!error && data) {
      setProducts(prev => [...prev, ...data]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Product Management</h2>
        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4">{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
