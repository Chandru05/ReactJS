'use client';

import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';

interface HeaderProps {
  user: any;
  isAdmin: boolean;
  logout: () => void;
  cartCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onLoginClick: () => void;
    searchQuery: string;                       
  setSearchQuery: (q: string) => void; 
}

export default function Header({
    user,
  isAdmin,
  logout,
  cartCount,
  onCartClick,
  onMenuClick,
  onLoginClick,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
    return (
          <header className="bg-white shadow-sm border-b sticky top-0 z-40">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-purple-600">StyleHub</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
              {searchQuery && (
    <button
      onClick={() => setSearchQuery('')}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
    </button>
  )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button onClick={onCartClick} className="relative p-2">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </button>
          
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">{user.name}</span>
              {isAdmin && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Admin</span>}
              <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-800">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick}  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <User className="h-5 w-5" />
              <span className="text-sm">Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  </header>
    );
}