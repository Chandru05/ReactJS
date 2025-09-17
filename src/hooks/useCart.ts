'use client';
import { useState } from 'react';

export function useCart() {
  const [cart, setCart] = useState<any[]>([]);
  
  const addToCart = (product:any, size:string, color:string, quantity = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && item.size === size && item.color === color
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { ...product, size, color, quantity }];
    });
  };
  
  const updateQuantity = (productId:number, size:string, color:string, quantity:number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      ).filter(item => item.quantity > 0)
    );
  };
  
  const removeFromCart = (productId:number, size:string, color:string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && item.size === size && item.color === color)
    ));
  };
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };
  
  return { cart, addToCart, updateQuantity, removeFromCart, getCartTotal, getCartCount };
};