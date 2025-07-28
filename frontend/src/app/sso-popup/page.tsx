'use client';

import { useState } from 'react';

export default function SSOPopup() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    
    const loginUrl = `http://localhost:3001/auth?redirect_uri=${encodeURIComponent('http://localhost:3000/auth-callback')}`;
    
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-8 text-center border-b border-gray-100 relative">
          <button 
            onClick={dismissPopup}
            className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
            →
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to access this feature and continue your journey</p>
        </div>
        
        <div className="p-6">
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
        </div>
      </div>
    </div>
  );
}