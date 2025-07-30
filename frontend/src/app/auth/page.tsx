'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { BACKEND_URL } from '../../../constants/urls';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get('redirect_uri');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        if (!email || !redirectUri) {
        console.error('Email and redirect URI are required');
        return;
        }
        const response = await fetch(`${BACKEND_URL}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            redirect_uri: redirectUri
        })
        });
        
        const data = await response.json();
        
        if (data.success && data.redirectTo) {
        // Frontend handles the redirect
        window.location.href = data.redirectTo;
        } else {
        console.error('Login failed:', data);
        }
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        setIsLoading(false);
    }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
            🔐
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to Continue</h2>
          <p className="text-gray-600">Enter your email to sign in</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder-gray-500"
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Log In'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-6">Powered by DIG</p>
      </div>
    </div>
  );
}