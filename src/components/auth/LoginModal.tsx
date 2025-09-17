'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface loginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string, isAdmin: string) => void;
}

const LoginModal: React.FC<loginProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, isAdmin ? 'admin' : 'customer');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="admin@stylehub.com or user@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="password"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="admin" className="text-sm">Login as Admin</label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Login
          </button>
        </form>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Demo credentials:</p>
          <p>Admin: admin@stylehub.com / password</p>
          <p>User: user@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;