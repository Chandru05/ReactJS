'use client';

import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';

interface CartItem {
    id: number;
    name:string;
    image:string;
    price: number;
    quantity: number;
    size: string;
    color: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: number, size: string, color: string, quantity: number) => void;
  removeFromCart: (id: number, size: string, color: string) => void;
  getCartTotal: () => number;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = 
({ isOpen, onClose, cart, updateQuantity, removeFromCart, getCartTotal, onCheckout }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart ({cart.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex items-center space-x-3 border-b pb-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.size} • {item.color}</p>
                      <p className="text-sm font-semibold text-purple-600">₹{item.price}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="border-t p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Total: ₹{getCartTotal()}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;