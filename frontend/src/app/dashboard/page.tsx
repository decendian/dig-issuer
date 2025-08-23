'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('user');
      
      // FIX 1: Check for exact string 'true', not just truthy
      if (isAuthenticated !== 'true' || !userData) {
        router.push('/login');
        return;
      }
      
      try {
        // Add try-catch around JSON.parse
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (parseError) {
        // Invalid JSON - redirect to login
        console.error('Invalid user data JSON:', parseError);
        router.push('/login');
      }
    } catch (storageError) {
      // Handle localStorage errors
      console.error('localStorage error:', storageError);
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          <p>Welcome back, {user.name}!</p>
          <p className="text-gray-600">Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
}