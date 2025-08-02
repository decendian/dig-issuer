'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BACKEND_URL } from '../../../constants/urls';
import AuthContainer from '../../components/ui/AuthContainer';
import AuthHeader from '../../components/ui/AuthHeader';

function SSOPopupContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  
  // Get redirect_uri from URL params (passed by parent)
  const redirectUri = searchParams.get('redirect_uri');

  const handleSignIn = () => {
    setIsLoading(true);
    
    // Use the redirect_uri passed from the parent application
    const loginUrl = `${BACKEND_URL}/auth?redirect_uri=${encodeURIComponent(redirectUri || '')}`;
    
    // Send message to parent window
    if (window.opener) {
      window.opener.postMessage({
        type: 'SSO_LOGIN',
        loginUrl: loginUrl
      }, '*');
    }
    
    // Redirect to login
    setTimeout(() => {
      window.location.href = loginUrl;
    }, 500);
  };

  const dismissPopup = () => {
    // Send message to parent window
    if (window.opener) {
      window.opener.postMessage({
        type: 'SSO_DISMISS'
      }, '*');
    }
    
    window.close();
  };

  return (
    <AuthContainer>
      <AuthHeader 
        icon="→"
        title="Sign In Required"
        subtitle="Please sign in to access this feature and continue your journey"
      />
      
      <div className="space-y-3">
        <button 
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-60"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Redirecting...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
        <button 
          onClick={dismissPopup}
          className="w-full bg-gray-100 text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </AuthContainer>
  );
}

export default function SSOPopup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SSOPopupContent />
    </Suspense>
  );
}