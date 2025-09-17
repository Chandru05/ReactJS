'use client';

import React, { useState, useEffect } from 'react';

import Header from '@/components/layout/Header';

import { CheckoutFormData, Product, Order, Customer, ProductVariant } from '@/components/types';
import AdminDashboard from '@/components/admin/AdminDashboard';
import LoginModal from '@/components/auth/LoginModal';

import CheckoutForm from '@/components/cart/CheckoutForm';
import CartSidebar from '@/components/cart/CartSidebar';

import ProductCard from '@/components/products/ProductCard';

import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Filter, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

import { supabase } from '@/lib/supabase';

// Mock data for development
const categories = [
  { id: 1, name: 'Dresses', slug: 'dresses', count: 45 },
  { id: 2, name: 'Tops', slug: 'tops', count: 32 },
  { id: 3, name: 'Bottoms', slug: 'bottoms', count: 28 },
  { id: 4, name: 'Ethnic Wear', slug: 'ethnic', count: 38 },
  { id: 5, name: 'Western Wear', slug: 'western', count: 42 }
];


const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Priya Sharma',
    email: 'priya@example.com',
    total: 5998,
    status: 'pending',
    date: '2024-08-24',
    items: [
      { productId: 1, name: 'Floral Summer Dress', quantity: 2, price: 2999 }
    ]
  },
  {
    id: 'ORD-002',
    customerName: 'Anita Kumar',
    email: 'anita@example.com',
    total: 3798,
    status: 'confirmed',
    date: '2024-08-23',
    items: [
      { productId: 2, name: 'Casual Cotton Top', quantity: 1, price: 1299 },
      { productId: 3, name: 'High Waist Jeans', quantity: 1, price: 2499 }
    ]
  }
];

const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    created_at: '2024-08-24',
  }
];


// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { products, setProducts } = useProducts();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([])

  
  const { cart, addToCart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const { user, isAdmin, login, logout } = useAuth();
  
  // const filteredProducts = selectedCategory === 'all' 
  //   ? products 
  //   : products.filter(product => product.category.toLowerCase().includes(selectedCategory.toLowerCase()));

const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  p.category.toLowerCase().includes(searchQuery.toLowerCase())
);
  
  const handleAddToCart = (product: Product, size: string, color: string) => {
    addToCart(product, size, color);
    // Show success message (in real app, you'd use a toast library)
    alert(`Added ${product.name} to cart!`);
  };
  
  const handleCheckout = (orderData: CheckoutFormData) => {
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerName: orderData.name,
      email: orderData.email,
      // phone: orderData.phone,
      //address: `${orderData.address}, ${orderData.city}, ${orderData.pincode}`,
      total: getCartTotal(),
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      })),
      //notes: orderData.notes
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    // Clear cart after successful order
    cart.forEach(item => removeFromCart(item.id, item.size, item.color));
    
    setIsCheckoutOpen(false);
    
    alert(`Order ${newOrder.id} placed successfully! We'll contact you soon to confirm.`);
  };

// Add Product
const handleAddProduct = async (product: Product, variants: ProductVariant[]) => {
  // add product
  const {id, ...productWithoutId} = product;
  const { data: productData, error: pErr } = await supabase
  .from("products")
  .insert([productWithoutId])
  .select()
  .single();

  if (pErr) {
    console.error("Error adding product:", pErr.message);
    return;
  }

  const prodId = productData.id;

    const variantsPayload = variants.map(v => ({
    product_id: prodId,
    size: v.size,
    color: v.color,
    stock: v.stock,
    original_price: v.original_price,
    discount: v.discount,
    sku: v.sku ?? null,
  }));

  if(!prodId) {
    console.error("Product ID is missing for variant upload.");
    return;
  }
  if(variantsPayload.length === 0) {
    console.warn("No variants to upload for this product.");
    return;
  }

  const { error: vErr } = await supabase
    .from('product_variants')
    .upsert(variantsPayload, { ignoreDuplicates: false })
    .eq('product_id', prodId);

  if (vErr) {
      if (vErr.code === '23505') { // Unique constraint violation
      alert('This product variant already exists!');
    } else {
      console.error('Error:', vErr.message);
    }
    return;
  }

  // Optimistically update the local products list
  setProducts(prev => [...prev, productData]);
};

// Update Product
const handleUpdateProduct = async (product: Product, variants: ProductVariant[]): Promise<void> => {
  // update product
  const { data: updatedProduct, error: puErr } = await supabase
    .from('products')
    .update({
      name: product.name,
      category: product.category,
      image: product.image,
      featured: product.featured ?? false,
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
      source_place: (product as any).source_place ?? null,
      vendor: (product as any).vendor ?? null
    })
    .eq('id', product.id)
    .select()
    .single();

  if (puErr) {
    console.error('product update err', puErr);
    return;
  }

  // Upsert variants: use upsert by unique(product_id, size, color)
  const variantsPayload = variants.map(v => ({
    id: v.id ?? undefined, // if id exists, db will update; if not, insert
    product_id: product.id,
    size: v.size,
    color: v.color,
    stock: v.stock,
    original_price: v.original_price,
    discount: v.discount,
    sku: v.sku ?? null,
  }));

  // Skip if no variants to upsert
  if (variantsPayload.length === 0) {
    console.warn("No variants to update for this product.");
    return;
  }

  // Debug: log the payload being sent
  console.log('Upserting variants payload:', variantsPayload);

  const { error: vErr } = await supabase
    .from('product_variants')
    .upsert(variantsPayload, { ignoreDuplicates: false });

  if (vErr) {
    console.error('variants upsert err', vErr);
    console.error('Full error object:', JSON.stringify(vErr, null, 2));
    return;
  }

  // Optimistically update the local products list
  setProducts(prev =>
    prev.map(p => (p.id === product.id ? { ...p, ...updatedProduct } : p))
  );
};

// Delete Product
const handleDeleteProduct = async (id: string) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product:", error.message);
    return;
  }

  setProducts(prev => prev.filter(p => p.id !== id));
};
  
  if (isAdmin && currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          user={user} 
          isAdmin={isAdmin} 
          logout={() => {
            logout();
            setCurrentView('shop');
          }} 
          cartCount={getCartCount()}
          onCartClick={() => setIsCartOpen(true)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onLoginClick={() => setIsLoginOpen(true)}
          searchQuery={searchQuery}                   
         setSearchQuery={setSearchQuery} 
        />
        <AdminDashboard 
          orders={orders}
          products={products}
          customers={customers}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct} 
          allVariants={[]}         />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        isAdmin={isAdmin} 
        logout={logout} 
        cartCount={getCartCount()}
        onCartClick={() => setIsCartOpen(true)}
        onMenuClick={() => setIsMobileMenuOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        searchQuery={searchQuery}                
        setSearchQuery={setSearchQuery} 
      />
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {!user && (
                  <button 
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 rounded hover:bg-gray-100"
                  >
                    Login
                  </button>
                )}
                
                {isAdmin && (
                  <button 
                    onClick={() => {
                      setCurrentView('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 rounded hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    setCurrentView('shop');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded hover:bg-gray-100"
                >
                  Shop
                </button>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setSelectedCategory('all');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-1 px-2 text-sm rounded hover:bg-gray-100"
                    >
                      All Products
                    </button>
                    {categories.map(category => (
                      <button 
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.slug);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left py-1 px-2 text-sm rounded hover:bg-gray-100"
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Categories</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left py-2 px-3 rounded transition-colors ${
                    selectedCategory === 'all' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                {categories.map(category => (
                  <button 
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`w-full text-left py-2 px-3 rounded transition-colors flex justify-between ${
                      selectedCategory === category.slug ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500">({category.count})</span>
                  </button>
                ))}
              </div>
              
              {isAdmin && (
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => setCurrentView('admin')}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                  >
                    Admin Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {selectedCategory === 'all' ? 'All Products' : 
                 categories.find(c => c.slug === selectedCategory)?.name || 'Products'} 
                ({filteredProducts.length})
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Sort by</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                    <option>Best Rated</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                   productVariants={variants.filter(v => v.product_id === product.id)}
                  onAddToCart={handleAddToCart}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        getCartTotal={getCartTotal}
        onCheckout={() => {
          if (!user) {
            setIsLoginOpen(true);
            setIsCartOpen(false);
          } else {
            setIsCheckoutOpen(true);
            setIsCartOpen(false);
          }
        }}
      />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={login}
      />
      
      {/* Checkout Form */}
      {isCheckoutOpen && (
        <CheckoutForm 
          cart={cart}
          total={getCartTotal()}
          onSubmit={handleCheckout}
          onCancel={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
};
export default App;