'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import AuthContainer from '../../components/ui/AuthContainer';
import AuthHeader from '../../components/ui/AuthHeader';
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
    <AuthContainer>
      <AuthHeader 
        icon="🔐"
        title="Login to Continue"
        subtitle="Enter your email to sign in"
      />
      
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
    </AuthContainer>
  );
}