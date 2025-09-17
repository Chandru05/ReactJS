'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Product, Order, Customer, ProductVariant } from '@/components/types';
import ProductForm from '@/components/products/ProductForm';

interface AdminDashboardProps {
  orders: Order[];
  products: (Product & { minPrice?: number; totalStock?: number })[];
  customers: Customer[];
  allVariants: ProductVariant[];
  onAddProduct: (product: Product, variants: ProductVariant[]) => Promise<void> | void;
  onUpdateProduct: (product: Product, variants: ProductVariant[]) => Promise<void> | void;
  onDeleteProduct: (id: string) => Promise<void> | void;
}
export default function AdminDashboard({
  orders,
  products,
  customers,
  allVariants,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'customers'>('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openForEdit = (product: Product | null) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {(['overview', 'orders', 'products', 'customers'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="mt-2 text-3xl font-semibold">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="mt-2 text-3xl font-semibold">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
            <p className="mt-2 text-3xl font-semibold">{customers.length}</p>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="px-6 py-4">{o.id}</td>
                    <td>{o.customerName}</td>
                    <td>{o.status}</td>
                    <td>₹{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Product Management</h2>
            <button
              onClick={() => openForEdit(null)}
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
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Min Price</th>
                  <th className="px-6 py-3 text-left">Total Stock</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4">{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.minPrice ?? '-'}</td>
                    <td>{p.totalStock ?? '-'}</td>
                    <td>
                      <button
                        onClick={() => openForEdit(p)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => p.id && onDeleteProduct(p.id)}
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
      )}

      {/* Customers */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold mb-4">Customers</h2>
          {customers.length === 0 ? (
            <p className="text-gray-500">No customers yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4">{c.id}</td>
                    <td>{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          variants={(allVariants ?? []).filter(v => v.product_id === editingProduct?.id)}
          onSave={async (product, variants) => {
            if (editingProduct) {
              await onUpdateProduct(product, variants);
            } else {
              await onAddProduct(product, variants);
            }
            closeForm();
          }}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
