'use client';

import { useEffect,useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        // you can store role in user_metadata (set in Supabase)
        setIsAdmin(data.session.user.user_metadata.role === 'admin');
      }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsAdmin(session?.user?.user_metadata?.role === 'admin');
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };
  
    const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };
  
  return { user, isAdmin, login, logout };
};