'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/components/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();

    // Real-time subscription
    const channel = supabase
      .channel('products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log("Realtime change:", payload);
          if (payload.eventType === "INSERT") {
            setProducts(prev => [...prev, payload.new as Product]);
          }
          if (payload.eventType === "UPDATE") {
            setProducts(prev =>
              prev.map(p => (p.id === payload.new.id ? (payload.new as Product) : p))
            );
          }
          if (payload.eventType === "DELETE") {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, setProducts };
}
