'use client'
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/app/lib/supabase';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        router.push('/login');
        return;
      }
      
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        router.push('/login');
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#001D4A] font-bold text-xl">
        Validando credenciales de acceso...
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
};