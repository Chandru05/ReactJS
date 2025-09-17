'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CartItem {
    id: number;
    name:String;
    price: number;
    quantity: number;
    size: string;
    color: string;
}

interface CheckoutFormProps {
    cart: CartItem[];
    total: number;
    onSubmit: (formData: any) => void;
    onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cart, total, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Checkout</h2>
            <button onClick={onCancel}>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex justify-between text-sm">
                    <span>{item.name} ({item.size}, {item.color}) x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total: ₹{total}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Shipping Information</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Any special instructions..."
                  ></textarea>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Payment Method:</strong> Cash on Delivery (COD)<br/>
                    You will pay when the order is delivered to your address.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Place Order
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;