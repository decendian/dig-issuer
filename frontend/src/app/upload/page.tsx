'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import AuthContainer from '../../components/ui/AuthContainer';
import AuthHeader from '../../components/ui/AuthHeader';
import { BACKEND_URL } from '../../../constants/urls';
import FileUpload from './file_upload';
import { Bacasime_Antique } from 'next/font/google';
function UploadPageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const redirectUri = searchParams.get('redirect_uri');
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("hey");
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data,
          email: email,
          redirect_uri: redirectUri
        })
      });

      if (response.redirected) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer gradientFrom="green-500" gradientTo="teal-600">
      <AuthHeader
        icon="📤"
        title={`Welcome, ${email}!`}
        subtitle="Upload something to continue"
        gradientFrom="green-500"
        gradientTo="teal-600"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <FileUpload setData={setData} />
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all disabled:opacity-60"
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </AuthContainer>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadPageContent />
    </Suspense>
  );
}