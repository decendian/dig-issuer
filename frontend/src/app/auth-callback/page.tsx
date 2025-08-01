'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token && window.opener) {
      window.opener.postMessage({
        type: 'SSO_SUCCESS',
        token: token
      }, '*'); // Using '*' because popup might be from file://
    }
    window.close();
  }, [searchParams]);

  return <div>Processing authentication...</div>;
}