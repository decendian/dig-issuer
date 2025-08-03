'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function AuthCallbackContent() {
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

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Processing authentication...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}