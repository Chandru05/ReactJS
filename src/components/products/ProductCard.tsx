'use client';


import React, { useState, useEffect } from "react";
import { Eye, Star } from "lucide-react";
import { Product, ProductVariant } from '@/components/types';


interface ProductCardProps {
  product: Product;
  productVariants: ProductVariant[];
  onAddToCart: (product: Product, size: string, color: string) => void;
  onQuickView: (product: Product) => void;
}


const ProductCard: React.FC<ProductCardProps> = ({ product, productVariants, onAddToCart, onQuickView }) => {
  // Compute available sizes and colors from variants
  const sizes = Array.from(new Set(productVariants.map((v: ProductVariant) => v.size)));
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] ?? '');
  const colors = Array.from(new Set(productVariants.filter((v: ProductVariant) => v.size === selectedSize).map((v: ProductVariant) => v.color)));
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? '');

  // Find the variant for the selected size/color
  const selectedVariant = productVariants.find((v: ProductVariant) => v.size === selectedSize && v.color === selectedColor);

  // Compute discount if possible
  const discount = selectedVariant && selectedVariant.original_price > 0
    ? Math.round(((selectedVariant.original_price - (selectedVariant.price ?? selectedVariant.original_price)) / selectedVariant.original_price) * 100)
    : 0;

  // Update colors when size changes
  useEffect(() => {
    const newColors = Array.from(new Set(productVariants.filter((v: ProductVariant) => v.size === selectedSize).map((v: ProductVariant) => v.color)));
    if (!newColors.includes(selectedColor)) {
      setSelectedColor(newColors[0] ?? '');
    }
    // eslint-disable-next-line
  }, [selectedSize]);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border">
      <div className="relative">
        <img
          src={product.image || undefined} 
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
        >
          <Eye className="h-6 w-6 text-white" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{product.category}</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xl font-bold text-purple-600">₹{selectedVariant?.price ?? selectedVariant?.original_price ?? '-'}</span>
          {selectedVariant && selectedVariant.original_price > (selectedVariant.price ?? 0) && (
            <span className="text-sm text-gray-500 line-through">₹{selectedVariant.original_price}</span>
          )}
        </div>
        
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium">Size:</span>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Color:</span>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Stock: {selectedVariant?.stock ?? '-'}</span>
          <span className={`text-xs px-2 py-1 rounded ${
            (selectedVariant?.stock ?? 0) > 10 ? 'bg-green-100 text-green-700' : 
            (selectedVariant?.stock ?? 0) > 0 ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {(selectedVariant?.stock ?? 0) > 10 ? 'In Stock' : (selectedVariant?.stock ?? 0) > 0 ? 'Low Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <button
          onClick={() => onAddToCart(product, selectedSize, selectedColor)}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {!selectedVariant || selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;